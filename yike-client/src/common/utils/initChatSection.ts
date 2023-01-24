export const initChatSection = (
  initOption: Pick<User.ChatSectionStructure, 'chatId' | 'chatTitle'>,
) => {
  const initChatSection: User.ChatSectionStructure = {
    ...initOption,
    chatMessages: [],
  }

  return initChatSection
}
