import { ofetch } from 'ofetch'

const config = useRuntimeConfig()
const API_ACCOR_URL = config.public.API_ACCOR_URL
const API_ACCOR_MAPS_URL = config.public.API_ACCOR_MAPS_URL
const API_ACCOR_API_KEY = config.public.API_ACCOR_API_KEY

let lastFilters: any = null
// let newSearchRequest = true

export async function autocomplete(q: string) {
  const { predictions } = await ofetch(`
  ${API_ACCOR_MAPS_URL}/?input=${q}&sources=google_places,hod_hotels&key=AIzaSyBbl6gcuSky-zngKf1xATiOj4xEudOC3rM&channel=test-newAutocomplete&max_results=15&language=fr&session_token=1489db7f-a5b9-5c5f-9e59-e65cfdf07287`, {
    method: 'GET',
  })

  return {
    data: predictions,
    total: predictions.length,
  }
}

export async function getHotels(filters?: any) {
  const query = {
    destination: filters?.destination && filters?.destination !== 'undefined' ? `${filters?.destination}`.toLowerCase() : 'Paris,+France',
    mediaCategories: 'HOTEL,BEDROOM,SUITE,BREAKFAST,RESTAURANT,BAR,SERVICE,MEETING_ROOM,BUSINESS_CENTER,THALASSO,HOTEL_ADVANTAGE,FAMILY,GOLF,DESTINATION,WEDDING,INSTITUTE',
    withMediaProductCode: false,
  }

  if (lastFilters) {
    if (lastFilters.destination !== filters.destination)
      lastFilters = filters
  }

  // const { results } = await ofetch(`https://api.accor.com/catalog/v1/hotels?q=${encodeURIComponent(JSON.stringify(filters))}`, {
  const { results } = await ofetch(`${API_ACCOR_URL}/catalog/v1/hotels?q=${query.destination}`, {
    method: 'GET',
    headers: {
      Apikey: `${API_ACCOR_API_KEY}`,
    },
  }).catch((error) => {
    throw new Error(error)
  })

  if (!results.length) {
    return {
      data: {
        available: [],
        unavailable: [],
      },
      total: results.length,
    }
  }

  const { availabilities } = await ofetch(`${API_ACCOR_URL}/availability/v3/best-offers`, {
    method: 'POST',
    headers: {
      Apikey: `${API_ACCOR_API_KEY}`,
    },
    body: {
      adults: filters.compositions.adults || 1,
      childrenAges: filters.compositions.childrenAges || [],
      dateIn: filters.dateIn || new Date().toISOString().split('T')[0],
      nights: filters.nights || 1,
      hotelCode: results.map(r => r.hotel?.id),
    },
  }).catch((error) => {
    throw new Error(error)
  })

  return {
    data: {
      available: availabilities.filter(a => a.status === 'OPEN').map(a => ({
        ...a,
        hotel: results.find(h => h.hotel?.id === a.hotelCode)?.hotel,
      })),
      unavailable: availabilities.filter(a => a.status === 'UNAVAILABLE').map(a => ({
        ...a,
        hotel: results.find(h => h.hotel?.id === a.hotelCode)?.hotel,
      })),
    },
    total: results.length,
  }
}

export async function getHotelRooms(hotelId: string, adults: number, childrenAges: any, dateIn: string, nights: number) {
  const { accommodations } = await ofetch(`${API_ACCOR_URL}/catalog/v1/hotels/${hotelId}/products/accommodations?fields=accommodations.id,accommodations.label,accommodations.description,accommodations.floorSpace,accommodations.configuration,accommodations.amenities,accommodations.surface,accommodations.medias,accommodations.configuration.beddings,accommodations.configuration.beddings.details,accommodations.configuration.beddings.extra.crib,accommodations.configuration.assets,accommodations.configuration.maxOccupancy,accommodations.configuration.situation.views,accommodations.configuration.situation.accessibility`, {
    method: 'GET',
    headers: {
      Apikey: `${API_ACCOR_API_KEY}`,
    },
  })
  const { rooms } = await ofetch(`${API_ACCOR_URL}/availability/v3/hotels/${hotelId}/rooms?fields=rooms.capacity,rooms.code,rooms.commercialOffers,rooms.offers,rooms.referenceOffers&adults=${adults}&childrenAges${childrenAges}=&dateIn=${dateIn}&nights=${nights}&pricing=true&pricingDetails=true&pricingFees=true&roomFamilies=&roomIndex=0`, {
    method: 'GET',
    headers: {
      Apikey: `${API_ACCOR_API_KEY}`,
    },
  })

  return {
    data: rooms.map(r => ({
      ...r,
      roomClass: accommodations.find(a => a.id === r.code),
    })),
    total: rooms.length,
  }
}

export async function getChannelBrands() {
  const data = await ofetch(`${API_ACCOR_URL}/referentials/v1/channel-brands`, {
    method: 'GET',
    headers: {
      Apikey: `${API_ACCOR_API_KEY}`,
    },
  })

  return {
    data,
    total: data.length,
  }
}

export async function getMediasHotel(id: string, size = '1024x768') {
  const type = 'IMAGE&withProductCode=false&category=HOTEL,BEDROOM,SUITE,BREAKFAST,RESTAURANT,BAR,SERVICE,MEETING_ROOM,BUSINESS_CENTER,THALASSO,HOTEL_ADVANTAGE,FAMILY,GOLF,DESTINATION,WEDDING,INSTITUTE'
  const data = await ofetch(`${API_ACCOR_URL}/catalog/v1/hotels/${id}/medias?type=${type}`, {
    method: 'GET',
    headers: {
      Apikey: `${API_ACCOR_API_KEY}`,
    },
  })

  return {
    data: size
      ? data.filter(i => i.formats.some(f => f.format === size)).map(i => ({
        category: i.category,
        type: i.type,
        path: i.formats.find(f => f.format === size).path,
      }))
      : data,
    total: data.length,
  }
}
