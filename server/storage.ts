import {
  users,
  workspaces,
  workspaceMembers,
  projects,
  tasks,
  timeEntries,
  messages,
  attachments,
  notes,
  clients,
  invoices,
  invoiceItems,
  clientInvitations,
  type User,
  type UpsertUser,
  type Workspace,
  type InsertWorkspace,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type TimeEntry,
  type InsertTimeEntry,
  type Message,
  type InsertMessage,
  type Attachment,
  type InsertAttachment,
  type Note,
  type InsertNote,
  type Client,
  type InsertClient,
  type Invoice,
  type InsertInvoice,
  type InvoiceItem,
  type InsertInvoiceItem,
  type WorkspaceMember,
  type ClientInvitation,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Workspace operations
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspace(id: number): Promise<Workspace | undefined>;
  updateWorkspace(id: number, workspace: Partial<InsertWorkspace>): Promise<Workspace>;
  deleteWorkspace(id: number): Promise<void>;
  addWorkspaceMember(workspaceId: number, userId: string, role: string): Promise<WorkspaceMember>;
  removeWorkspaceMember(workspaceId: number, userId: string): Promise<void>;
  getWorkspaceMembers(workspaceId: number): Promise<WorkspaceMember[]>;

  // Client operations
  createClient(client: InsertClient): Promise<Client>;
  getUserClients(userId: string): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getWorkspaceProjects(workspaceId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  getProjectTasks(projectId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  updateTaskPositions(updates: { id: number; position: number; status: string }[]): Promise<void>;

  // Time tracking operations
  createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry>;
  getUserTimeEntries(userId: string): Promise<TimeEntry[]>;
  getTaskTimeEntries(taskId: number): Promise<TimeEntry[]>;
  getActiveTimeEntry(userId: string): Promise<TimeEntry | undefined>;
  updateTimeEntry(id: number, timeEntry: Partial<InsertTimeEntry>): Promise<TimeEntry>;
  deleteTimeEntry(id: number): Promise<void>;

  // Chat operations
  createMessage(message: InsertMessage): Promise<Message>;
  getProjectMessages(projectId: number): Promise<Message[]>;
  deleteMessage(id: number): Promise<void>;

  // File operations
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  getTaskAttachments(taskId: number): Promise<Attachment[]>;
  getMessageAttachments(messageId: number): Promise<Attachment[]>;
  deleteAttachment(id: number): Promise<void>;

  // Notes operations
  createNote(note: InsertNote): Promise<Note>;
  getWorkspaceNotes(workspaceId: number): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number): Promise<void>;

  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getUserInvoices(userId: string): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]>;
  deleteInvoiceItem(id: number): Promise<void>;

  // Client portal operations
  createClientInvitation(projectId: number, clientEmail: string, token: string, expiresAt: Date): Promise<ClientInvitation>;
  getClientInvitation(token: string): Promise<ClientInvitation | undefined>;
  deleteClientInvitation(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Workspace operations
  async createWorkspace(workspace: InsertWorkspace): Promise<Workspace> {
    const [newWorkspace] = await db.insert(workspaces).values(workspace).returning();
    return newWorkspace;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    return await db
      .select()
      .from(workspaces)
      .leftJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(and(eq(workspaces.ownerId, userId)))
      .orderBy(desc(workspaces.createdAt));
  }

  async getWorkspace(id: number): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace;
  }

  async updateWorkspace(id: number, workspace: Partial<InsertWorkspace>): Promise<Workspace> {
    const [updated] = await db
      .update(workspaces)
      .set({ ...workspace, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return updated;
  }

  async deleteWorkspace(id: number): Promise<void> {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  }

  async addWorkspaceMember(workspaceId: number, userId: string, role: string): Promise<WorkspaceMember> {
    const [member] = await db
      .insert(workspaceMembers)
      .values({ workspaceId, userId, role })
      .returning();
    return member;
  }

  async removeWorkspaceMember(workspaceId: number, userId: string): Promise<void> {
    await db
      .delete(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)));
  }

  async getWorkspaceMembers(workspaceId: number): Promise<WorkspaceMember[]> {
    return await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
  }

  // Client operations
  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async getUserClients(userId: string): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const [updated] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updated;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getWorkspaceProjects(workspaceId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Task operations
  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async getProjectTasks(projectId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(asc(tasks.position));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const [updated] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async updateTaskPositions(updates: { id: number; position: number; status: string }[]): Promise<void> {
    for (const update of updates) {
      await db
        .update(tasks)
        .set({ position: update.position, status: update.status, updatedAt: new Date() })
        .where(eq(tasks.id, update.id));
    }
  }

  // Time tracking operations
  async createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry> {
    const [newEntry] = await db.insert(timeEntries).values(timeEntry).returning();
    return newEntry;
  }

  async getUserTimeEntries(userId: string): Promise<TimeEntry[]> {
    return await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.userId, userId))
      .orderBy(desc(timeEntries.createdAt));
  }

  async getTaskTimeEntries(taskId: number): Promise<TimeEntry[]> {
    return await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.taskId, taskId))
      .orderBy(desc(timeEntries.createdAt));
  }

  async getActiveTimeEntry(userId: string): Promise<TimeEntry | undefined> {
    const [entry] = await db
      .select()
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, userId), eq(timeEntries.endTime, null)))
      .orderBy(desc(timeEntries.startTime));
    return entry;
  }

  async updateTimeEntry(id: number, timeEntry: Partial<InsertTimeEntry>): Promise<TimeEntry> {
    const [updated] = await db
      .update(timeEntries)
      .set(timeEntry)
      .where(eq(timeEntries.id, id))
      .returning();
    return updated;
  }

  async deleteTimeEntry(id: number): Promise<void> {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));
  }

  // Chat operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getProjectMessages(projectId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.projectId, projectId))
      .orderBy(asc(messages.createdAt));
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  // File operations
  async createAttachment(attachment: InsertAttachment): Promise<Attachment> {
    const [newAttachment] = await db.insert(attachments).values(attachment).returning();
    return newAttachment;
  }

  async getTaskAttachments(taskId: number): Promise<Attachment[]> {
    return await db
      .select()
      .from(attachments)
      .where(eq(attachments.taskId, taskId))
      .orderBy(desc(attachments.createdAt));
  }

  async getMessageAttachments(messageId: number): Promise<Attachment[]> {
    return await db
      .select()
      .from(attachments)
      .where(eq(attachments.messageId, messageId))
      .orderBy(desc(attachments.createdAt));
  }

  async deleteAttachment(id: number): Promise<void> {
    await db.delete(attachments).where(eq(attachments.id, id));
  }

  // Notes operations
  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async getWorkspaceNotes(workspaceId: number): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.workspaceId, workspaceId))
      .orderBy(desc(notes.updatedAt));
  }

  async getNote(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }

  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note> {
    const [updated] = await db
      .update(notes)
      .set({ ...note, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updated;
  }

  async deleteNote(id: number): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  // Invoice operations
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async getUserInvoices(userId: string): Promise<Invoice[]> {
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updated] = await db
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  async createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem> {
    const [newItem] = await db.insert(invoiceItems).values(item).returning();
    return newItem;
  }

  async getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
    return await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, invoiceId));
  }

  async deleteInvoiceItem(id: number): Promise<void> {
    await db.delete(invoiceItems).where(eq(invoiceItems.id, id));
  }

  // Client portal operations
  async createClientInvitation(projectId: number, clientEmail: string, token: string, expiresAt: Date): Promise<ClientInvitation> {
    const [invitation] = await db
      .insert(clientInvitations)
      .values({ projectId, clientEmail, token, expiresAt })
      .returning();
    return invitation;
  }

  async getClientInvitation(token: string): Promise<ClientInvitation | undefined> {
    const [invitation] = await db
      .select()
      .from(clientInvitations)
      .where(eq(clientInvitations.token, token));
    return invitation;
  }

  async deleteClientInvitation(id: number): Promise<void> {
    await db.delete(clientInvitations).where(eq(clientInvitations.id, id));
  }
}

export const storage = new DatabaseStorage();
