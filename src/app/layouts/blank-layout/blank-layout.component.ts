import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavAuthComponent } from "../../components/nav-auth/nav-auth.component";
import { NavBlankComponent } from "../../components/nav-blank/nav-blank.component";

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterOutlet, NavAuthComponent, NavBlankComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})
export class BlankLayoutComponent {

}
