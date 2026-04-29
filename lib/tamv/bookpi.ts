type BookPiEntryInput = {
  title: string
  summary: string
  tags: string[]
}

export class BookPiService {
  publishEntry(input: BookPiEntryInput) {
    return {
      id: `bookpi_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...input,
    }
  }
}
