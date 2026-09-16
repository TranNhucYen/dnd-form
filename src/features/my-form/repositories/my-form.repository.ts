import { MyForm, FormStatus, SharedUser } from '../types/my-form.type'

export interface IMyFormRepository {
  findAll(): Promise<any[]>
  findById(id: number): Promise<any | null>
  create(data: any): Promise<any>
  update(id: number, data: any): Promise<any | null>
  delete(id: number): Promise<any>
  duplicate(
    id: number,
    customData?: { title?: string; description?: string }
  ): Promise<any | null>
  updateStatus(id: number, status: FormStatus): Promise<any | null>
  updateSharing(
    id: number,
    sharing: { isPublic: boolean; sharedWith: SharedUser[] }
  ): Promise<any | null>
}

export const drizzleMyFormRepository: IMyFormRepository = {
  async findAll() {
    throw new Error('Method not implemented')
  },
  async findById() {
    throw new Error('Method not implemented')
  },
  async create() {
    throw new Error('Method not implemented')
  },
  async update() {
    throw new Error('Method not implemented')
  },
  async delete() {
    throw new Error('Method not implemented')
  },
  async duplicate() {
    throw new Error('Method not implemented')
  },
  async updateStatus() {
    throw new Error('Method not implemented')
  },
  async updateSharing() {
    throw new Error('Method not implemented')
  },
}
