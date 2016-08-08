/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { DirectionServiceService } from './direction-service.service';

describe('Service: DirectionService', () => {
  beforeEach(() => {
    addProviders([DirectionServiceService]);
  });

  it('should ...',
    inject([DirectionServiceService],
      (service: DirectionServiceService) => {
        expect(service).toBeTruthy();
      }));
});
