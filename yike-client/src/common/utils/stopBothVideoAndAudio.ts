/**
 * @description 退出房间时清除媒体流
 */
export function stopBothVideoAndAudio(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState === 'live') {
      track.stop()
    }
  })
}
