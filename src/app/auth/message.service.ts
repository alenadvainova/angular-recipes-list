import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MessageService {
  private subject = new Subject<any>();

  public setMessage(message: string) {
    this.subject.next({ text: message });
  }

  public getMessage() {
    return this.subject.asObservable();
  }

  public clearMessage() {
    this.subject.next();
  }
}
