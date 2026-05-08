import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'clothes',
    name: 'Clothes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgFcw0-WDeHrzuxl_9QSC-2WIr-OsWWy1fsco_DN2SEpg6PatbjcRziSV_C12jhEUyflF5La-x13NkzCYGQU-Eh8qi_VqMUIdBJWgGxM92H2OHlVFohvDvTiowipmNC4vLVSLnpfxxnp3KbbZ5GtdsGYWd6L-X-Es7HslHKjUANNKTctFrYmMSa78yN2jl3Ygp-9cxFxHAxKNo02JxPcBuJM61shhXDsBES5UMX-36QeO9-tydfSmOuTbsONKAJy4m39Z5Yu6EACZA',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_nYVxULfI05aM6USoVaw5uyLte9HPr-TId5yUdUcAmhXBygkh5QNjsznxwemoh74fyE8W9SYS8qRd_vjZXKznlUB_YY4g1F9tBoM85xV8KaGJkG0LRZTCNDLFVtImGc96UZkzjYf8D5q4UpzoreVqoTx31eaJtKdbGjrhJdEhvtPCw9k-1DHE7V9jB_bsrCc2EbbcvYFNL2lNWENKdZzdFpVfMF7untp6NH6Kyw8uSm2hXB-iTv6pGBhGtSf79AQHqR-Om9HUoIH',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Architectural Silk Blouse',
    price: 42000,
    description: 'A luxury silk blouse draped over a minimalist mannequin.',
    category: 'clothes',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDY3kXPO8RfWGucxSMzt6qud2i2zEp4v6yclsowhT9AjT-R-w7kheTsN3MtpEXGID5wgBZjkNGDJdQY33lvgDXUL964Huyo6haCEGhaKmudyRwkonyZM7O6-E1e7sbyBBoh04RsUW2eJV63Di7Jh4sojICIN6ezRYLn7aXpCfebsEKfGnCC4dIJvfNj_R9FVo6YWuxGz_q1aWVLTOcGWTs07ad1pNuokk-Td5Z2eSKwO6bwnbg8GKIKM4HH-dv-jDpX-i2tCPpeJxIe'],
    colors: ['Royal Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    story: 'Close up of a luxury silk blouse in midnight blue draped over a minimalist mannequin.',
    inStock: true,
    stockCount: 15,
    sku: 'AY-2024-001',
    isNewArrival: true,
  },
  {
    id: '2',
    name: 'Structured Wool Trouser',
    price: 58000,
    description: 'Impeccably tailored high-waisted wool trousers in charcoal grey.',
    category: 'clothes',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDrCKYq7gC8fsoSIRSR2GRtcSMslvpLzxFQdkt_jo2dEdihuFRKFOhF0niEOXMbP2q54VxDk6Kr0T5kIvDrJQHTSEbv0Uwd1i9nvOXhJK67wpcKHZwXHWtHkxWRb-sIdkev8ce8go-Ahidx5q-kLR1yZoQnbmkOYbGH6lD6I27XYbLPCso9BmwSM2twby_zNVXNhTriQ7C21zg3CiMxJFNaAGpgVXEXnbbBKSA25JPTbO7c8DfRFSLNqVY7-vtu_ig-wKFYEVFx3yIF'],
    colors: ['Charcoal'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 12,
    sku: 'AY-2024-008',
    isNewArrival: true,
  },
  {
    id: '3',
    name: 'Minimalist Tote Bag',
    price: 115000,
    description: 'Sleek black leather handbag with silver hardware details.',
    category: 'accessories',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBUEqsYbXRUqiIkYs7JpqrK6SKgSQ_CS5Z9k8ikqxMMh5cLXRnM9HqlcoI_5Eo-dzGZ8XuPr3uPMtdh2KAWVjSIDpMk8F9_ZAe4zzIFTYrAn118uDfGyES6_5TGB9uG0rRWTYDrfZv__V0pIsIqUnW7-zPlMeBml7xejM-nEcOHIwHjdZiXfcuoVFBlFsNY00l9o4wAeZkrtEnzLpBrZJlD0-kdXEaRLSjo7UqkpHGWJRKHK6pSRaq-qVtKjQLUVp7xMsEp_NRIscaY'],
    colors: ['Obsidian'],
    sizes: ['One Size'],
    inStock: true,
    stockCount: 5,
    sku: 'AY-2024-015',
  },
  {
    id: '4',
    name: 'Shop Structured Blazer',
    price: 145000,
    description: 'Masterclass in modern tailoring with architectural silhouette.',
    category: 'clothes',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwCem-NbBKvdgTJM5hCpXa_KApg4PpY_HEMMRqfA5mf5VNcreVF21fHYw5vh8Z_0ARKzT5HUrZar8Px5Hws4CTcaPHFDBanE1Wvqa6TTt4tFnn728KozHB7iQ8bT2Uxkk3dI1SlCR3U2Jp28uzQ5f4hixRv7zdaBmFb6ZOxvg3oGdeo1tosndaXdMZbrH4hkA8E-UVQ8vMlO3Ho5E6pIp8mQxmFUqQRtYLQkHIrQ2d1amuWqI3WGyiS153vmgzqzWxy9Vw5a7feSvg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMrBbeT2nUSVZxkn5AiJZSNErBJXPJ0xhOza2-u65UCoZoSm1c9Spl8fhA-ComYbQl4I8I5OHMoC-JH9wyIi-ntY_tl87DOJUrK6qfb9JETsZcjPo-Zvf8zeYeNgH3ljbAv8a6rb4URqI6aBRE0ey6PvqymWLDFzQe2xywdQn_Wsn68aaDc52AoJIqTuRRlFi6LtVa9MYepUGLsDR0qt95iWJi0krdWsklkDJobGOxDRCLtbtpxtauR_SxYt-KvsKtiOAYAYhBz-jJ'
    ],
    colors: ['Bone White'],
    sizes: ['S', 'M', 'L', 'XL'],
    story: 'Crafted from premium Italian wool crepe, the Shop Structured Blazer represents the pinnacle of modern tailoring. Its architectural silhouette is achieved through meticulous canvas padding and hand-finished lapels.',
    inStock: true,
    stockCount: 8,
    sku: 'AY-2024-022',
    isNewArrival: true,
  }
];
