import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDialogComponent } from './article-dialog.component';

describe('AddDialogComponent', () => {
  let component: ArticleDialogComponent;
  let fixture: ComponentFixture<ArticleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
