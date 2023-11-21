export interface Adventure {
    description: string
    urgent: boolean
    important: boolean
    createdAt?: number
}

export interface World {
    slug: string
    name: string
    img: string
    adventures: Adventure[]
    createdAt?: number
}
