export function handleForm(ev: SubmitEvent, f: () => void | Promise<void>) {
  ev.preventDefault();
  
  f();
}
