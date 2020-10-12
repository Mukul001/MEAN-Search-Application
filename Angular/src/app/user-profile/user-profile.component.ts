import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { IssueService } from '../shared/issue.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { User } from '../shared/user.model';
import { NgForm } from '@angular/forms';

declare var M: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails: any;
  constructor(public userService: UserService,private issueService: IssueService, private router: Router) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
      },
      err => {
        console.log(err);

      }
    );
    this.resetForm();
    this.refreshUserList();
  }

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.userService.selectedUser = {
      _id: "",
      fullName: "",
      mobileNo: "",
      email: "",
      password:""
    }
  }

  onSubmit(form: NgForm) {
    if (form.value._id == "") {
      this.userService.postUser(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshUserList();
        this.router.navigateByUrl('/userprofile');
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.userService.putUser(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshUserList();
        this.router.navigateByUrl('/userprofile');
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      },
      err =>{
        console.log(err);
      });
    }
  }

  refreshUserList() {
    this.userService.getUserList().subscribe((res) => {
      this.userService.users= res as User[];
    });
  }

  onEdit(userDetails: User ) {
    this.userService.selectedUser = userDetails;
  }

  private regNumberSubject = new Subject<string>();
      readonly issues$ = this.regNumberSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(regNumber => this.issueService.fetchIssues(regNumber))
      );

        searchIssues(regNumber: string) {
          this.regNumberSubject.next(regNumber);
        }


  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
