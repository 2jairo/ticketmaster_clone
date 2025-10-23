import { Component, inject, OnInit } from '@angular/core';
import { Carousel } from "../carousel/carousel";
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-home-component',
  imports: [Carousel],
  templateUrl: './home-component.html'
})
export class HomeComponent implements OnInit {
  private categoriesService = inject(CategoriesService)

  categories: { src: string, navigateTo: string, title: string }[] = []

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((cats) => {
      this.categories = cats.map((cat) => {
        return cat.images.map((src) => ({
          src,
          navigateTo: `/events?category=${cat.slug}`,
          title: cat.title,
        }))
      }).flat()
    })
  }
}
