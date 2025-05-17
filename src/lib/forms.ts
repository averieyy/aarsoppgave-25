// A very basic functoin that forms can use to not reload the page on submit
export function handleForm(ev: SubmitEvent, f: () => void | Promise<void>) {
  ev.preventDefault();
  
  f();
}