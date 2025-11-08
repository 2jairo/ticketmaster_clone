import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommentResponseWrapper } from '../../types/comments';
import { Pagination } from '../categories/filters';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommentCard } from './comment-card';
import { UserAuthService } from '../../services/userAuth.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShowError } from "../auth-form/show-error";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { JwtService } from '../../services/jwt.service';
import { UserAvatar } from "../user-avatar/user-avatar";

@Component({
  selector: 'app-comment-list',
  imports: [CommentCard, AsyncPipe, RouterLink, ShowError, ReactiveFormsModule, InfiniteScrollDirective, UserAvatar],
  templateUrl: './comment-list.html'
})
export class CommentList implements OnInit {
  readonly userAuthService = inject(UserAuthService)
  private profileService = inject(ProfileService)
  private fb = inject(FormBuilder)
  private jwtService = inject(JwtService)


  @Input({ required: true }) concertSlug!: string
  @Input({ required: true }) getComments!: (p: Pagination) => Observable<CommentResponseWrapper[]>

  newCommentForm = this.fb.group({
    message: new FormControl('', [Validators.maxLength(environment.COMMENT_MAX_LENGTH)])
  })
  error = {
    msg: '',
    general: false
  }

  messageLength = signal(0)

  comments: CommentResponseWrapper[] = []
  pagination: Pagination = {
    offset: 0,
    size: environment.COMMENTS_PAGE_SIZE
  }

  loading = false
  allLoaded = false
  loadComments(): void {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.getComments(this.pagination).subscribe({
      next: (newComments) => {
        if (newComments.length === 0) {
          this.allLoaded = true
        } else {
          this.comments = [...this.comments, ...newComments]
          this.pagination.offset += newComments.length
        }
      },
      complete: () => this.loading = false
    })
  }

  ngOnInit(): void {
    this.newCommentForm.valueChanges.subscribe(() => {
      const value = this.newCommentForm.get('message')?.value || ''
      this.messageLength.set(value.length)

      this.error = {
        msg: '',
        general: false
      }

      const message = this.newCommentForm.get('message')
      if (message?.hasError('maxlength')) {
        this.error.msg = `The comment length can't be more than ${environment.COMMENT_MAX_LENGTH}`
      }
    })
  }

  handleSubmit() {
    if(!this.newCommentForm.valid) {
      return
    }
    if(this.jwtService.checkIfLogged()) {
      return
    }

    const message = this.newCommentForm.get('message')?.value || ''
    this.profileService.createComment(this.concertSlug, message).subscribe({
      next: (c) => {
        this.comments.unshift(c)
        this.resetComment()
      },
      error: () => {
        this.error = {
          general: true,
          msg: 'An unexpected error occurred. Please try again later.'
        }
      }
    })

  }

  resetComment() {
    this.newCommentForm.setValue({
      message: ''
    })
  }

  deleteComment(c: CommentResponseWrapper) {
    this.comments = this.comments.filter(comment => comment.id !== c.id);
  }

  hasError(msg: any) {
    return msg ? 'true' : ''
  }
}
