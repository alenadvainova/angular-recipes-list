import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { MessageService } from "../message.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-message",
  templateUrl: "message.component.html",
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() message: string = null;
  messageSub: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageSub = this.messageService.getMessage().subscribe((message) => {
      this.message = message.text;
    });
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }

  onClose() {
    this.message = null;
  }
}
