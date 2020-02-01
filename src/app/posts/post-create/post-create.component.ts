import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector : 'app-post-create',
  templateUrl : './post-create.component.html',
  styleUrls : ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy{
  newPost;
  enteredTitle;
  enteredContent;
  private mode = 'create';
  private postId: string;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  updatePost: Post;
  private authStatusSub: Subscription;
  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListenter().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getUpdatePost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.updatePost = {id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath, creator: postData.creator};
          this.form.setValue({
            title: this.updatePost.title,
            content: this.updatePost.content,
            image: this.updatePost.imagePath
          });
        });
      }
      else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file});
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost(){
          // alert(postInput.value);
          // console.dir(postInput);
          // this.newPost = this.enteredValue;
    if(this.form.invalid){
      return;
    }

    // const post: Post = {
    //   // title: this.enteredTitle,
    //   // content: this.enteredContent
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
