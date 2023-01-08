/**
 * @description 移除音视频轨道
 * @param stream
 */
export function stopBothVideoAndAudio(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    track.stop()
  })
}
