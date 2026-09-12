import { MessagesView } from "@/components/admin/messages-view"
import { getContactMessages } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminMessagesPage() {
  const messages = await getContactMessages()
  return <MessagesView messages={messages} />
}
