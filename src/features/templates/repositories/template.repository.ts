import { Template } from "../types/template.type"


export interface ITemplateRepository {
  findById(id: number): Promise<any | null>
  findAll(): Promise<any[]>

}

export const drizzleTemplateRepository:ITemplateRepository = {
  async findById(id: number){
    throw new Error('Method not implemented')

  },
  async findAll(){
    throw new Error('Method not implemented')
  }
}