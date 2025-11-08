import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommentResponseWrapper } from '../../types/comments';
import { ProfileService } from '../../services/profile.service';
import { JwtService } from '../../services/jwt.service';
import { UserAvatar } from "../user-avatar/user-avatar";

@Component({
  selector: 'app-comment-card',
  imports: [RouterLink, UserAvatar],
  templateUrl: './comment-card.html'
})
export class CommentCard {
  private profileService = inject(ProfileService)
  private jwtService = inject(JwtService)

  @Input({ required: true }) comment!: CommentResponseWrapper
  @Input({ required: true }) concertSlug!: string
  @Output() onDelete = new EventEmitter<CommentResponseWrapper>()

  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  toggleCommentLike() {
    if(this.jwtService.checkIfLogged()) {
      return
    }

    this.profileService.setLikeComment(this.comment.id, !this.comment.liked).subscribe(() => {
      this.comment.liked = !this.comment.liked
    })
  }

  settingsDeleteComment() {
    if(this.jwtService.checkIfLogged()) {
      return
    }

    this.profileService.deleteComment(this.concertSlug, this.comment.id).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDelete.emit(this.comment)
    })
  }
}
