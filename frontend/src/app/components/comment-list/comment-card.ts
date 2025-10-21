import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommentResponseWrapper } from '../../types/comments';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-comment-card',
  imports: [RouterLink],
  templateUrl: './comment-card.html'
})
export class CommentCard {
  private profileService = inject(ProfileService)

  @Input({ required: true }) comment!: CommentResponseWrapper
  @Input({ required: true }) concertSlug!: string
  @Output() onDelete = new EventEmitter<CommentResponseWrapper>()

  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  toggleCommentLike() {
    this.profileService.setLikeComment(this.comment.id, !this.comment.liked).subscribe(() => {
      this.comment.liked = !this.comment.liked
    })
  }

  settingsDeleteComment() {
    this.profileService.deleteComment(this.concertSlug, this.comment.id).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDelete.emit(this.comment)
    })
  }
}
