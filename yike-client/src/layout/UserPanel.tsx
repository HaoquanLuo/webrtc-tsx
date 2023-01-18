import { useSelector } from 'react-redux'
import { selectRoomParticipants } from '@/redux/features/system/systemSlice'
import IconBox from '@/components/IconBox'

interface Props {}

const messages = [
  {
    id: '1',
    content: `Hello everyone! I'm YingLong Ma`,
    author: 'YingLong Ma',
  },
  {
    id: '2',
    content: `Nice to see you guys!`,
    author: 'YingLong Ma',
  },
  {
    id: '3',
    content: `你好，马应龙。我是马杰克`,
    author: 'Jack Ma',
  },
]

const UserPanel: React.FC<Props> = (props) => {
  const roomParticipants = useSelector(selectRoomParticipants)

  return (
    <div sm:w-60 md:w-80 h-a shrink-0 p-2 flex flex-col gap-y-2 justify-between>
      <div h-60>
        {roomParticipants
          ? roomParticipants.map((user) => {
              return (
                <div
                  key={user.id}
                  className="text-gray my-1 px-2 py-1 hover:bg-op-20 hover:bg-gray hover:rd-2"
                >
                  <div font-bold>{user.username}</div>
                  <div>{user.socketId}</div>
                </div>
              )
            })
          : null}
      </div>
      <div flex-1 flex flex-col bg-slate-200 bg-op-40 rd-2>
        <div flex-1 flex flex-col p-1>
          {messages.map((msg, index) => {
            const sameAuthor =
              index > 0 && msg.author === messages[index - 1].author
            return (
              <div key={msg.id} className={`m-1`}>
                {!sameAuthor && (
                  <div
                    font-bold
                    text-sm
                    mx-1
                    className={`${
                      msg.author === 'YingLong Ma' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.author}
                  </div>
                )}
                <div
                  className={`px-2 py-1 bg-violet rd-2 w-fit  ${
                    msg.author === 'YingLong Ma' ? 'float-right' : 'float-left'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
        </div>
        <div relative h-a rd-2>
          <textarea
            rows={4}
            className={`
              block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg
              border border-gray-300
              focus:ring-blue-500 focus:border-blue-500
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              dark:focus:ring-blue-500 dark:focus:border-blue-500
            `}
            placeholder="Write your message here..."
          ></textarea>
          <IconBox
            className="absolute bottom-2 right-1"
            icon={<div i-mdi-send rotate--30 />}
            handleClick={() => {
              console.log('Send')
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default UserPanel
