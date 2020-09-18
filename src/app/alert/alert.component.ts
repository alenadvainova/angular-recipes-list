import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { MessageService } from "../auth/message.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() message: string;
  @Output() close = new EventEmitter<void>();
  messageSub: Subscription;

  constructor(private messageService: MessageService) {}

  onClose() {
    this.close.emit();
  }

  ngOnInit() {
    this.messageSub = this.messageService.getMessage().subscribe((message) => {
      this.message = message;
    });
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }
}
