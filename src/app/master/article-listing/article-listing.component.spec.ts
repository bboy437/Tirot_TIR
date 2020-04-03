import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleListingComponent } from './article-listing.component';

describe('ArticleListingComponent', () => {
  let component: ArticleListingComponent;
  let fixture: ComponentFixture<ArticleListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
