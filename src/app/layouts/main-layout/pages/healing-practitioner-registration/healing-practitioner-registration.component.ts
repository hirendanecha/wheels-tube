import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-healing-practitioner-registration',
  templateUrl: './healing-practitioner-registration.component.html',
  styleUrls: ['./healing-practitioner-registration.component.scss'],
})
export class HealingPractitionerRegistrationComponent implements OnInit {
  profileId: number;

  allCountryData: any;
  selectedCountry = 'US';
  allStateData: any;
  selectedState = '';

  isCountryChecked: boolean = true;
  isWorldwideChecked: boolean = false;
  
  selectPractitionerPage: boolean;
  
  practitionerArea: any = [];
  selectedAreaValues: number[] = [];
  
  dealershipBybrand: boolean = false;
  selectedCards: any[] = [];
  cards: any[] = [
    {
      title: 'Enter sales person name',
      id: 1,
      name: '',
      zip: '',
      type: 'sales',
    },
    {
      title: 'Find a car dealership by location',
      id: 2,
      zip: '',
      type: 'dealership',
    },
    {
      title: 'Enter dealership name',
      id: 3,
      name: '',
      zip: '',
      type: 'dealership',
    },
    {
      title: 'Find a car dealership by brand name',
      id: 4,
      zip: '',
      type: 'dealership',
    }
  ];
  repairCards: any[] = [
    {
      title: 'Find a car dealership service department',
      id: 5,
      zip: '',
      type: 'repair',
    },
    {
      title: 'Find a car or truck repair business',
      id: 6,
      zip: '',
      type: 'repair',
    }
  ];
  isFromHome = false;

  constructor(
    private seoService: SeoService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    private communityService: CommunityService,
  ) {
    const queryParams = this.route.snapshot.queryParams;
    const newParams = { ...queryParams };
    // console.log(this.router.routerState.snapshot.url);
    this.selectPractitionerPage = this.router.routerState.snapshot.url.includes('request-video-call') || false;
    this.isFromHome = this.router.routerState.snapshot.url.includes('request-video-call') || false;
    // console.log(this.selectPractitionerPage)
    // this.channelId = this.shareService?.channelData?.id;
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log(params.channelId);
    if (newParams['token']) {
      const token = newParams['token'];
      this.tokenStorage.saveToken(token)
      delete newParams['token']
      const navigationExtras: NavigationExtras = {
        queryParams: newParams
      };
      this.router.navigate([], navigationExtras);
    }

    this.profileId = Number(localStorage.getItem('profileId'));
    const data = {
      title: 'Wheels.Tube Registration',
      url: `${environment.webUrl}wheels-registration`,
      description: '',
    };
    this.seoService.updateSeoMetaData(data);
  }

  ngOnInit(): void {
    this.getAllCountries();
    this.getCategories();
  }

  updateCheckbox(selectedOption: 'country' | 'worldwide') {
    if (selectedOption === 'country' && this.isWorldwideChecked) {
      this.isWorldwideChecked = false;
    } else if (selectedOption === 'worldwide' && this.isCountryChecked) {
      // this.selectedCountry = '';
      // this.selectedState = '';
      // this.allStateData = null
      this.isCountryChecked = false;
    }
  }

  getAllCountries() {
    this.spinner.show();
    this.customerService.getCountriesData().subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allCountryData = result;
        this.getAllState();
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  getAllState() {
    this.spinner.show();
    const selectCountry = this.selectedCountry;
    this.customerService.getStateData(selectCountry).subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allStateData = result;
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  isSelected(cardId: number): boolean {
    return this.selectedCards.some(card => card.id === cardId);
  }

  selectCard(card: any): void {
    const cardIndex = this.selectedCards.findIndex((selectedCard) => selectedCard.id === card.id);
    if (cardIndex === -1) {
      [this.cards, this.repairCards].forEach(cardArr => {
        cardArr.forEach(card => {
          card.name = '';
          card.zip = '';
        });
      });
      this.selectedCards = [];
      this.selectedCards.push(card);
    } else {
      this.selectedCards.splice(cardIndex, 1);
    }
    this.dealershipBybrand = this.selectedCards.some(card => card.id === 4);
  }

  changeCountry() {
    if (this.isCountryChecked) {
      this.getAllState();
    }
  }

  backPreview() {
    this.selectedCards = [];
    this.dealershipBybrand = !this.dealershipBybrand;
  }

  nextPageSearch() {
    const data = this.selectedCards[0]
    data.state = this.selectedState
    data.country = this.selectedCountry
    if (this.selectedCards.some(card => card.name || card.zip)) {
      const practitionerRequirements = { selectedCard: data };
      this.router.navigate(['/dealerships'], { state: { data: practitionerRequirements }});
    } else if (this.dealershipBybrand) {
      const areaValues = { selectedAreas: this.selectedAreaValues } 
      this.router.navigate(['/dealerships'], { state: { data: areaValues }});
    } else {
      this.toastService.danger('Please select What are you interested in it.');
    }
  }

  getCategories() {
    this.communityService.getCategories().subscribe({
      next: (res) => {
        this.practitionerArea = res.area;
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  onAreaboxChange(event: any, area: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedAreaValues.push(area.aId);
    } else {
      this.selectedAreaValues = this.selectedAreaValues.filter(
        (id) => id !== area.aId
      );
    }
  }
}
