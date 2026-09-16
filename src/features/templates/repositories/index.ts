import { isMockMode } from "@/lib/config";
import { drizzleTemplateRepository } from "./template.repository";
import { templateMockRepository } from "./template.mock.repository";

export const templateRepository = isMockMode()
  ? templateMockRepository
  : drizzleTemplateRepository;
