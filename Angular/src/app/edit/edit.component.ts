import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { User } from '../shared/user.model';
import { NgForm } from '@angular/forms';


declare var M: any;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  userDetails: any;
  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
      },
      err => {
        console.log(err);
      }
    );
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
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.userService.putUser(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshUserList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
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

}
