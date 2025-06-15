import { HumanloopClient } from 'humanloop';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
  sessionId?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface HumanloopAgentResponse {
  content: string;
  role: 'assistant';
  metadata?: any;
}

export class ChatHistoryService {
  private sessions: Map<string, ChatSession> = new Map();
  private humanloopClient: HumanloopClient;
  private readonly DEFAULT_PROMPT_PATH = 'polygloss/chat-agent';

  constructor(apiKey?: string) {
    this.humanloopClient = new HumanloopClient({
      apiKey: apiKey || process.env.HUMANLOOP_KEY,
    });
  }

  /**
   * Create a new chat session
   */
  createSession(userId?: string): ChatSession {
    const sessionId = uuidv4();
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Create or get session with specific ID (useful for static session IDs)
   */
  createOrGetSession(sessionId: string, userId?: string): ChatSession {
    const existingSession = this.getSession(sessionId);
    if (existingSession) {
      return existingSession;
    }

    const session: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get a chat session by ID
   */
  getSession(sessionId: string): ChatSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): ChatSession[] {
    return Array.from(this.sessions.values()).filter((session) => session.userId === userId);
  }

  /**
   * Add a message to a session
   */
  addMessage(
    sessionId: string,
    content: string,
    senderId: string,
    role: 'user' | 'assistant' | 'system'
  ): ChatMessage {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const message: ChatMessage = {
      id: uuidv4(),
      content,
      senderId,
      timestamp: new Date().toISOString(),
      role,
      sessionId,
    };

    session.messages.push(message);
    session.updatedAt = new Date().toISOString();

    return message;
  }

  /**
   * Get chat history for a session
   */
  getHistory(sessionId: string): ChatMessage[] {
    const session = this.getSession(sessionId);
    return session ? session.messages : [];
  }

  /**
   * Clear a session's history
   */
  clearHistory(sessionId: string): boolean {
    const session = this.getSession(sessionId);
    if (!session) {
      return false;
    }

    session.messages = [];
    session.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Call Humanloop agent with chat history context
   */
  async callAgent(
    sessionId: string,
    userMessage: string,
    userId: string = 'anonymous'
  ): Promise<HumanloopAgentResponse> {
    try {
      const session = this.getSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Add user message to history
      this.addMessage(sessionId, userMessage, userId, 'user');

      // Prepare messages for Humanloop (convert to the expected format)
      const messages = session.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call Humanloop agent
      const response = await this.humanloopClient.prompts.call({
        id: 'pr_1BmwfgqzWhjB5IoJmeerP',
        environment: 'production',
        messages: messages,
        inputs: {
          language: 'es',
        },
      });

      if (!response.logs[0]?.output) {
        throw new Error('No response from Humanloop');
      }

      // Extract content from response - check different possible response structures
      let assistantContent: string = response.logs[0]?.output;

      // Add assistant response to history
      const assistantMessage = this.addMessage(
        sessionId,
        assistantContent,
        'assistant',
        'assistant'
      );

      return {
        content: assistantContent,
        role: 'assistant',
        metadata: {
          messageId: assistantMessage.id,
          timestamp: assistantMessage.timestamp,
          sessionId,
        },
      };
    } catch (error) {
      console.error('Error calling Humanloop agent:', error);
      throw new Error(
        `Failed to get agent response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get statistics about chat sessions
   */
  getStats(): {
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    activeSessions: number;
  } {
    const totalSessions = this.sessions.size;
    const totalMessages = Array.from(this.sessions.values()).reduce(
      (sum, session) => sum + session.messages.length,
      0
    );

    // Consider sessions active if they have messages in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const activeSessions = Array.from(this.sessions.values()).filter(
      (session) => session.updatedAt > oneDayAgo
    ).length;

    return {
      totalSessions,
      totalMessages,
      averageMessagesPerSession: totalSessions > 0 ? totalMessages / totalSessions : 0,
      activeSessions,
    };
  }
}

// Singleton instance
export const chatHistoryService = new ChatHistoryService();
