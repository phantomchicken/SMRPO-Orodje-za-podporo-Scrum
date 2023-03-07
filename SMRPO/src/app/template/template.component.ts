import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})


export class TemplateComponent implements OnInit {
  constructor(private router:Router) { }
  ngOnInit(): void {
    //console.log("template log")
  }
  navto(url:string) {
    this.router.navigate([url])
    this.closeNav()
  }
  openNav() {
    if(window.innerWidth<576){
      // @ts-ignore
      document.getElementById("mySidenav").style.width = "100%";
      // @ts-ignore
      document.getElementById("items").style.paddingTop = "30vh";
      // @ts-ignore
      document.getElementById("navbarImage").setAttribute("src", "/images/layout_mobile.svg")
      // @ts-ignore
      document.getElementById("navbarImage").style.top="100px"
      // @ts-ignore
      document.getElementById("navbarImage").style.right="0px"
    }else{
      // @ts-ignore
      document.getElementById("mySidenav").style.width = "30vw";
      // @ts-ignore
      document.getElementById("items").style.paddingTop = "10vh";
    }
  }
  closeNav() {
    // @ts-ignore
    document.getElementById("mySidenav").style.transition = "0.5s";
    // @ts-ignore
    document.getElementById("mySidenav").style.width = "0";
  }
  openBol() {
    // @ts-ignore
    if(document.getElementById("bolezen-drop").style.maxHeight=="0px")
      // @ts-ignore
      document.getElementById("bolezen-drop").style.maxHeight="500px";
    else
      // @ts-ignore
      document.getElementById("bolezen-drop").style.maxHeight="0px";
  }




}
