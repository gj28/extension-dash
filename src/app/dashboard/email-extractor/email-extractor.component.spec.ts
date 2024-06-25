import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailExtractorComponent } from './email-extractor.component';

describe('EmailExtractorComponent', () => {
  let component: EmailExtractorComponent;
  let fixture: ComponentFixture<EmailExtractorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailExtractorComponent]
    });
    fixture = TestBed.createComponent(EmailExtractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
