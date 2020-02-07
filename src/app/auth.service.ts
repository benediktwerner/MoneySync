import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<any>;

  constructor(private auth: AngularFireAuth) {
    this.user = this.auth.authState;
  }

  async googleSignIn() {
    await this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  async signOut() {
    await this.auth.signOut();
  }
}
