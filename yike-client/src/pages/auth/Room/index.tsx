import React, { useEffect } from 'react'

const Room: React.FC = () => {
  async function getUserMediaStream() {
    try {
      const constraints = {
        audio: true,
        video: true,
      }
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err: any) {
      throw new Error(err)
    }
  }

  useEffect(() => {
    const myVideo: HTMLVideoElement = document.querySelector('#my-video')!
    getUserMediaStream().then((res) => {
      try {
        myVideo.srcObject = res
      } catch (error) {
        console.log(error)
      }
    })
  }, [])

  return (
    <>
      <h2>Room</h2>
      <div id="video-container" w-a h-a grid gap-2>
        <div w-fit h-fit b-2 rd-2>
          <video id="my-video" controls />
        </div>
        {/* <div w-a h-a b-2 rd-2>
          2
        </div>
        <div w-a h-a b-2 rd-2>
          3
        </div>
        <div w-a h-a b-2 rd-2>
          4
        </div> */}
      </div>
    </>
  )
}

export default Room
