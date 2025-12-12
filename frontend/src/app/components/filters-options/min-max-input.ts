import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-min-max-input',
  templateUrl: './min-max-input.html',
  imports: [FormsModule],
  styleUrls: []
})
export class MinMaxInput {
  @Input() minLimit = 0;
  @Input() maxLimit = 1000;
  @Input() step = 10;
  @Input() disabled = false;

  @Input() min = 100;
  @Input() max = 700;

  @Output() minMaxChange = new EventEmitter<{ min: number; max: number }>();

  onRangeChange(from: 'min' | 'max') {
    if (from === 'min' && this.min > this.max - this.step) {
      this.max = this.min;
    }
    else if (from === 'max' && this.max < this.min + this.step) {
      // console.log(this.min, this.max)
      this.min = this.max;
    }
    this.minMaxChange.emit({ min: this.min, max: this.max });
  }
}
