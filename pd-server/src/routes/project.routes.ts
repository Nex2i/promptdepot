import { FastifyInstance, FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { HttpMethods } from '@/utils/HttpMethods';
import { ProjectService, CreateProjectData } from '@/modules/project.service';
import { UserService } from '@/modules/user.service';

const basePath = '/projects';

// Schema for create project endpoint
const createProjectBodySchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String({ maxLength: 1000 })),
  tenantId: Type.String(),
});

// Schema for project response
const projectResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  tenantId: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  permissions: Type.Array(Type.String()),
  users: Type.Array(
    Type.Object({
      userId: Type.String(),
      permissions: Type.Array(Type.String()),
    })
  ),
});

export default async function ProjectRoutes(fastify: FastifyInstance, _opts: RouteOptions) {
  // GET /projects - Get all projects user has read access to
  fastify.route({
    method: HttpMethods.GET,
    url: `${basePath}`,
    preHandler: [fastify.authPrehandler], // Ensure user is authenticated
    schema: {
      tags: ['Projects'],
      summary: 'Get User Projects',
      description: 'Get all projects that the authenticated user has read access to',
      response: {
        200: Type.Object({
          message: Type.String(),
          projects: Type.Array(projectResponseSchema),
        }),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // The user object from Supabase is attached by the authPrehandler
        const supabaseUser = (request as any).user;

        if (!supabaseUser?.id) {
          reply.status(401).send({ message: 'User not authenticated' });
          return;
        }

        // Get the user from database using Supabase ID
        const user = await UserService.getUserBySupabaseId(supabaseUser.id);
        if (!user) {
          reply.status(404).send({ message: 'User not found in database' });
          return;
        }

        // Fetch projects user has read access to
        const projects = await ProjectService.getUserProjects(user.id);

        reply.status(200).send({
          message: 'Projects retrieved successfully',
          projects: projects,
        });
      } catch (error: any) {
        fastify.log.error(`Error fetching projects: ${error.message}`);
        reply.status(500).send({
          message: 'Failed to fetch projects',
          error: error.message,
        });
      }
    },
  });

  // POST /projects - Create a new project
  fastify.route({
    method: HttpMethods.POST,
    url: `${basePath}`,
    preHandler: [fastify.authPrehandler], // Ensure user is authenticated
    schema: {
      body: createProjectBodySchema,
      tags: ['Projects'],
      summary: 'Create Project',
      description: 'Create a new project and assign the creator as the owner',
      response: {
        201: Type.Object({
          message: Type.String(),
          project: projectResponseSchema,
        }),
      },
    },
    handler: async (
      request: FastifyRequest<{
        Body: {
          name: string;
          description?: string;
          tenantId: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        // The user object from Supabase is attached by the authPrehandler
        const supabaseUser = (request as any).user;

        if (!supabaseUser?.id) {
          reply.status(401).send({ message: 'User not authenticated' });
          return;
        }

        // Get the user from database using Supabase ID
        const user = await UserService.getUserBySupabaseId(supabaseUser.id);
        if (!user) {
          reply.status(404).send({ message: 'User not found in database' });
          return;
        }

        const { name, description, tenantId } = request.body;

        // Verify user has access to the tenant (optional security check)
        // You might want to add this based on your business logic
        // const userTenant = await TenantService.getUserTenant(user.id, tenantId);
        // if (!userTenant) {
        //   reply.status(403).send({ message: 'User does not have access to this tenant' });
        //   return;
        // }

        // Create project data
        const createProjectData: CreateProjectData = {
          name,
          description,
          tenantId,
          createdByUserId: user.id,
        };

        // Create the project
        const project = await ProjectService.createProject(createProjectData);

        // Get the project with permissions for response
        const projectWithPermissions = await ProjectService.getProjectById(project.id, user.id);

        reply.status(201).send({
          message: 'Project created successfully',
          project: projectWithPermissions,
        });
      } catch (error: any) {
        fastify.log.error(`Error creating project: ${error.message}`);
        reply.status(500).send({
          message: 'Failed to create project',
          error: error.message,
        });
      }
    },
  });

  // GET /projects/:projectId - Get a specific project by ID
  fastify.route({
    method: HttpMethods.GET,
    url: `${basePath}/:projectId`,
    preHandler: [fastify.authPrehandler],
    schema: {
      params: Type.Object({
        projectId: Type.String(),
      }),
      tags: ['Projects'],
      summary: 'Get Project by ID',
      description: 'Get a specific project if user has read access',
      response: {
        200: Type.Object({
          message: Type.String(),
          project: projectResponseSchema,
        }),
      },
    },
    handler: async (
      request: FastifyRequest<{
        Params: {
          projectId: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const supabaseUser = (request as any).user;

        if (!supabaseUser?.id) {
          reply.status(401).send({ message: 'User not authenticated' });
          return;
        }

        const user = await UserService.getUserBySupabaseId(supabaseUser.id);
        if (!user) {
          reply.status(404).send({ message: 'User not found in database' });
          return;
        }

        const { projectId } = request.params;

        const project = await ProjectService.getProjectById(projectId, user.id);

        if (!project) {
          reply.status(404).send({ message: 'Project not found or access denied' });
          return;
        }

        reply.status(200).send({
          message: 'Project retrieved successfully',
          project: project,
        });
      } catch (error: any) {
        fastify.log.error(`Error fetching project: ${error.message}`);
        reply.status(500).send({
          message: 'Failed to fetch project',
          error: error.message,
        });
      }
    },
  });

  // GET /projects/:projectId/details - Get detailed project with directories and prompts (4 levels deep)
  fastify.route({
    method: HttpMethods.GET,
    url: `${basePath}/:projectId/details`,
    preHandler: [fastify.authPrehandler],
    schema: {
      params: Type.Object({
        projectId: Type.String(),
      }),
      tags: ['Projects'],
      summary: 'Get Detailed Project Structure',
      description: 'Get project with full directory hierarchy and items up to 4 levels deep',
      response: {
        200: Type.Object({
          message: Type.String(),
          project: Type.Object({
            id: Type.String(),
            name: Type.String(),
            description: Type.Optional(Type.String()),
            tenantId: Type.String(),
            createdAt: Type.String(),
            updatedAt: Type.String(),
            permissions: Type.Array(Type.String()),
            directories: Type.Array(
              Type.Object({
                id: Type.String(),
                name: Type.String(),
                description: Type.Optional(Type.String()),
                isRoot: Type.Boolean(),
                type: Type.Literal('directory'),
                children: Type.Array(Type.Any()), // Recursive structure
                prompts: Type.Array(
                  Type.Object({
                    id: Type.String(),
                    name: Type.String(),
                    description: Type.Optional(Type.String()),
                    type: Type.Literal('prompt'),
                    createdAt: Type.String(),
                    updatedAt: Type.String(),
                  })
                ),
                createdAt: Type.String(),
                updatedAt: Type.String(),
              })
            ),
          }),
        }),
      },
    },
    handler: async (
      request: FastifyRequest<{
        Params: {
          projectId: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const supabaseUser = (request as any).user;

        if (!supabaseUser?.id) {
          reply.status(401).send({ message: 'User not authenticated' });
          return;
        }

        const user = await UserService.getUserBySupabaseId(supabaseUser.id);
        if (!user) {
          reply.status(404).send({ message: 'User not found in database' });
          return;
        }

        const { projectId } = request.params;

        // Get project with detailed structure
        const projectDetails = await ProjectService.getProjectDetails(projectId, user.id, 4);

        if (!projectDetails) {
          reply.status(404).send({ message: 'Project not found or no access' });
          return;
        }

        reply.status(200).send({
          message: 'Project details retrieved successfully',
          project: projectDetails,
        });
      } catch (error: any) {
        fastify.log.error(`Error fetching project details: ${error.message}`);
        reply.status(500).send({
          message: 'Failed to fetch project details',
          error: error.message,
        });
      }
    },
  });
}
