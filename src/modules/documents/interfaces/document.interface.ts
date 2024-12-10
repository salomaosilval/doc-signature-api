import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

export interface IDocumentService {
  create(data: CreateDocumentDto): Promise<Document>;
  findAll(): Promise<Document[]>;
  findOne(id: string): Promise<Document>;
  update(id: string, data: UpdateDocumentDto): Promise<Document>;
  remove(id: string): Promise<void>;
}
