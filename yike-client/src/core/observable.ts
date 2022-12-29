class Observable {
  static observers: Function[] = []

  subscribe(f: Function) {
    Observable.observers.push(f)
  }

  unsubscribe(f: Function) {
    Observable.observers = Observable.observers.filter((ob) => ob !== f)
  }

  notify(data: any) {
    Observable.observers.forEach((ob) => ob(data))
  }
}
export default new Observable()
