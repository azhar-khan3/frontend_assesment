import { Component, OnInit } from '@angular/core';
import { UserService, User } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  sortDir: { [key: string]: boolean } = { name: true, company: true };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u => 
      u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }

  sortBy(key: 'name' | 'company') {
    this.sortDir[key] = !this.sortDir[key];
    this.filteredUsers.sort((a, b) => {
      const valA = key === 'company' ? a.company.name : a[key];
      const valB = key === 'company' ? b.company.name : b[key];
      return this.sortDir[key] ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }
}