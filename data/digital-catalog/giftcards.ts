import { DigitalProductItem } from "./types";

export const DIGITAL_GIFTCARDS: DigitalProductItem[] = [
  {
    name: "Xbox Game Pass Ultimate - Suscripción 1 Mes (Global)",
    nameEn: "Xbox Game Pass Ultimate - 1 Month Subscription (Global)",
    slug: "xbox-game-pass-ultimate-1-month-global-key",
    sku: "DIG-XGPU-1M",
    description: "Acceso ilimitado a más de 400 videojuegos de alta calidad en consola Xbox, PC con Windows y Cloud Gaming en tu teléfono móvil o TV. Incluye EA Play y multijugador online.",
    descriptionEn: "Unlimited access to over 400 high-quality games on Xbox consoles, PC, and Cloud Gaming on mobile or smart TV. Includes EA Play and online multiplayer.",
    price: 11.99,
    compareAtPrice: 16.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "Más Vendido 🎮",
    badgeEn: "Top Seller 🎮",
    isActive: true,
    features: [
      { label: "Plataforma", value: "Xbox Series X|S, Xbox One, PC y Cloud" },
      { label: "Incluye", value: "EA Play + Xbox Cloud Gaming + Game Pass Core" },
      { label: "Región", value: "Global / Sin Restricciones" }
    ],
    featuresEn: [
      { label: "Platform", value: "Xbox Series X|S, One, PC, Cloud Gaming" },
      { label: "Includes", value: "EA Play + Cloud Gaming + Online Multiplayer" },
      { label: "Region", value: "Global / Region Free" }
    ],
    digitalAsset: {
      platform: "Xbox",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Ve a redeem.microsoft.com con tu cuenta de Microsoft/Xbox.\n2. Escribe la clave oficial de 25 caracteres.\n3. Disfruta de todo el catálogo al instante.",
      activationInstructionsEn: "1. Go to redeem.microsoft.com.\n2. Enter the 25-character key.\n3. Access 400+ games immediately."
    }
  },
  {
    name: "Xbox Game Pass Ultimate - Suscripción 3 Meses (Global)",
    nameEn: "Xbox Game Pass Ultimate - 3 Months Subscription (Global)",
    slug: "xbox-game-pass-ultimate-3-months-global-key",
    sku: "DIG-XGPU-3M",
    description: "90 días de acceso ininterrumpido a lanzamientos de Xbox Game Studios desde el primer día (Halo, Forza, Starfield, Doom). Juega en PC, consola o streaming en la nube.",
    descriptionEn: "90 days of uninterrupted access to day-one Xbox Game Studios releases (Forza, Halo, Starfield, Doom). Play on PC, console, or cloud streaming.",
    price: 32.99,
    compareAtPrice: 50.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "Ahorro 3 Meses ⚡",
    badgeEn: "3 Months Savings ⚡",
    isActive: true,
    features: [
      { label: "Duración", value: "3 Meses Completos (90 Días)" },
      { label: "Lanzamientos", value: "Juegos First-Party desde el Día 1" },
      { label: "Región", value: "Global" }
    ],
    featuresEn: [
      { label: "Duration", value: "3 Full Months (90 Days)" },
      { label: "Releases", value: "Day-One First-Party Game Access" },
      { label: "Region", value: "Global" }
    ],
    digitalAsset: {
      platform: "Xbox",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Abre redeem.microsoft.com.\n2. Inicia sesión y canjea el código de 25 dígitos.\n3. Tu suscripción se activará por 3 meses.",
      activationInstructionsEn: "1. Visit redeem.microsoft.com.\n2. Sign in and enter 25-digit code.\n3. Subscription active for 3 full months."
    }
  },
  {
    name: "Steam Wallet Gift Card $20 USD - Saldo Digital Global",
    nameEn: "Steam Wallet Gift Card $20 USD - Digital Code",
    slug: "steam-wallet-gift-card-20-usd",
    sku: "DIG-STEAM-20USD",
    description: "Añade $20 USD directamente a tu monedero de Steam. Úsalo para comprar cualquier juego, DLC, pase de batalla, skins de Counter-Strike 2 o ítems de la comunidad.",
    descriptionEn: "Add $20 USD directly to your Steam Wallet balance. Use it for any game, DLC, in-game skins for CS2, Dota 2, or Community Market items.",
    price: 21.99,
    compareAtPrice: 25.00,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "Saldo Inmediato 💳",
    badgeEn: "Instant Balance 💳",
    isActive: true,
    features: [
      { label: "Valor", value: "$20.00 Dólares USD de Saldo" },
      { label: "Sin Vencimiento", value: "El saldo nunca expira en tu cuenta" },
      { label: "Plataforma", value: "Steam PC / Mac / Steam Deck" }
    ],
    featuresEn: [
      { label: "Value", value: "$20.00 USD Steam Balance" },
      { label: "Expiry", value: "Funds never expire once redeemed" },
      { label: "Platform", value: "Steam PC / Mac / Steam Deck" }
    ],
    digitalAsset: {
      platform: "Steam",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Abre Steam y haz clic en tu nombre de usuario arriba a la derecha -> 'Ver mi monedero'.\n2. Haz clic en 'Canjear una tarjeta de regalo de Steam o un código del monedero'.\n3. Ingresa la clave y el saldo se acreditará al instante.",
      activationInstructionsEn: "1. Open Steam -> View my wallet.\n2. Click 'Redeem a Steam Gift Card or Wallet Code'.\n3. Enter the code and balance is added immediately."
    }
  },
  {
    name: "Steam Wallet Gift Card $50 USD - Saldo Digital Global",
    nameEn: "Steam Wallet Gift Card $50 USD - Digital Code",
    slug: "steam-wallet-gift-card-50-usd",
    sku: "DIG-STEAM-50USD",
    description: "$50 USD de saldo directo en Steam. Ideal para aprovechar las rebajas de verano o invierno de Steam o adquirir los últimos lanzamientos de temporada.",
    descriptionEn: "$50 USD direct Steam Wallet credit. Perfect for Steam Summer / Winter sales or grabbing brand new AAA blockbuster releases.",
    price: 52.99,
    compareAtPrice: 60.00,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "Más Buscado 🎮",
    badgeEn: "Most Wanted 🎮",
    isActive: true,
    features: [
      { label: "Valor", value: "$50.00 Dólares USD Netos" },
      { label: "Compatibilidad", value: "Válido para cuentas en USD / Global" },
      { label: "Entrega", value: "Clave Digital Oficial" }
    ],
    featuresEn: [
      { label: "Value", value: "$50.00 USD Net Credit" },
      { label: "Compatibility", value: "USD & Global Accounts" },
      { label: "Delivery", value: "Official Digital Key" }
    ],
    digitalAsset: {
      platform: "Steam",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Ve a store.steampowered.com/account/redeemwalletcode.\n2. Inicia sesión e ingresa el código.\n3. Disfruta de tus $50 USD de saldo.",
      activationInstructionsEn: "1. Go to store.steampowered.com/account/redeemwalletcode.\n2. Sign in and enter the code.\n3. Enjoy your $50 USD balance."
    }
  },
  {
    name: "PlayStation Network (PSN) Gift Card $25 USD - Cuenta USA",
    nameEn: "PlayStation Network (PSN) Card $25 USD - US Account",
    slug: "playstation-network-psn-card-25-usd",
    sku: "DIG-PSN-25USD",
    description: "Recarga $25 USD en tu cuenta de PlayStation Store. Compra juegos digitales para PS5 y PS4, complementos, pases de batalla o suscripción a PlayStation Plus.",
    descriptionEn: "Add $25 USD to your PlayStation Store account. Buy digital games for PS5 & PS4, add-ons, battle passes, or extend PlayStation Plus.",
    price: 26.99,
    compareAtPrice: 30.00,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "PlayStation Oficial 🎮",
    badgeEn: "Official PlayStation 🎮",
    isActive: true,
    features: [
      { label: "Consolas", value: "PlayStation 5, PlayStation 4 y PS App" },
      { label: "Región", value: "Cuentas PlayStation Store USA" },
      { label: "Saldo", value: "$25.00 USD" }
    ],
    featuresEn: [
      { label: "Consoles", value: "PS5, PS4, and PlayStation App" },
      { label: "Region", value: "PlayStation Store US Accounts" },
      { label: "Balance", value: "$25.00 USD" }
    ],
    digitalAsset: {
      platform: "PlayStation",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. En tu consola PS5 o PS4, abre PlayStation Store.\n2. Selecciona 'Canjear código' en el menú de perfil.\n3. Ingresa los 12 caracteres del código.",
      activationInstructionsEn: "1. On PS5/PS4, open PlayStation Store.\n2. Select 'Redeem Code' under profile menu.\n3. Enter the 12-character code."
    }
  },
  {
    name: "PlayStation Network (PSN) Gift Card $50 USD - Cuenta USA",
    nameEn: "PlayStation Network (PSN) Card $50 USD - US Account",
    slug: "playstation-network-psn-card-50-usd",
    sku: "DIG-PSN-50USD",
    description: "$50 USD de saldo para PlayStation Store. Compra los últimos exclusivos de PS5 como Astro Bot, Spider-Man 2 o renueva tu membresía PS Plus Extra.",
    descriptionEn: "$50 USD credit for PlayStation Store. Purchase latest PS5 blockbusters like Astro Bot, Spider-Man 2, or extend PS Plus Extra membership.",
    price: 52.99,
    compareAtPrice: 60.00,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "PS5 & PS4 🕹️",
    badgeEn: "PS5 & PS4 🕹️",
    isActive: true,
    features: [
      { label: "Saldo", value: "$50.00 USD Directos en tu Monedero" },
      { label: "Región", value: "PlayStation Network USA" },
      { label: "Vigencia", value: "Sin fecha de expiración" }
    ],
    featuresEn: [
      { label: "Balance", value: "$50.00 USD Direct Wallet Funds" },
      { label: "Region", value: "PlayStation Network US Region" },
      { label: "Expiry", value: "No expiration date" }
    ],
    digitalAsset: {
      platform: "PlayStation",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Abre la app PlayStation o entra en store.playstation.com.\n2. Pulsa en tu avatar -> 'Canjear código'.\n3. Introduce los 12 dígitos y disfruta.",
      activationInstructionsEn: "1. Open PlayStation app or visit store.playstation.com.\n2. Click avatar -> 'Redeem Code'.\n3. Enter 12-digit key."
    }
  },
  {
    name: "Nintendo eShop Gift Card $20 USD - Cuenta USA / Global",
    nameEn: "Nintendo eShop Card $20 USD - Digital Code",
    slug: "nintendo-eshop-gift-card-20-usd",
    sku: "DIG-NINTENDO-20USD",
    description: "Recarga $20 USD en tu consola Nintendo Switch. Adquiere títulos indie aclamados, contenido descargable o clásicos de Nintendo Switch Online.",
    descriptionEn: "Add $20 USD to your Nintendo Switch eShop balance. Purchase acclaimed indie gems, DLC expansions, or Nintendo Switch Online memberships.",
    price: 21.99,
    compareAtPrice: 25.00,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "Nintendo Switch 🍄",
    badgeEn: "Nintendo Switch 🍄",
    isActive: true,
    features: [
      { label: "Consolas", value: "Nintendo Switch, Switch OLED y Switch Lite" },
      { label: "Saldo", value: "$20.00 USD eShop" },
      { label: "Región", value: "Cuentas Nintendo eShop USA" }
    ],
    featuresEn: [
      { label: "Consoles", value: "Nintendo Switch, Switch OLED, Switch Lite" },
      { label: "Balance", value: "$20.00 USD eShop" },
      { label: "Region", value: "Nintendo US eShop Accounts" }
    ],
    digitalAsset: {
      platform: "Nintendo",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. En tu Nintendo Switch, abre Nintendo eShop desde el menú HOME.\n2. Selecciona 'Canjear código' en la barra lateral izquierda.\n3. Introduce los 16 caracteres del código suministrado.",
      activationInstructionsEn: "1. On Nintendo Switch, open eShop from HOME menu.\n2. Select 'Redeem Code' on left sidebar.\n3. Enter the 16-character code."
    }
  },
  {
    name: "Roblox 1,000 Robux - Código Digital Oficial Global",
    nameEn: "Roblox 1,000 Robux - Official Global Digital Code",
    slug: "roblox-1000-robux-digital-code",
    sku: "DIG-ROBLOX-1000",
    description: "1,000 Robux para personalizar tu avatar con ropa exclusiva, accesorios, animaciones y desbloquear pases de juego en tus experiencias favoritas de Roblox.",
    descriptionEn: "1,000 Robux to customize your avatar with exclusive outfits, accessories, emotes, and unlock VIP gamepasses in top Roblox experiences.",
    price: 13.99,
    compareAtPrice: 18.00,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Gift Cards & Suscripciones",
    categoryEn: "Gift Cards & Subscriptions",
    badge: "Roblox Oficial 💎",
    badgeEn: "Official Roblox 💎",
    isActive: true,
    features: [
      { label: "Contenido", value: "1,000 Robux Directos en tu Cuenta" },
      { label: "Plataformas", value: "PC, Móvil (iOS/Android), Xbox, PlayStation" },
      { label: "Región", value: "Global / Sin Restricciones" }
    ],
    featuresEn: [
      { label: "Content", value: "1,000 Robux Direct to Your Account" },
      { label: "Platforms", value: "PC, Mobile (iOS/Android), Xbox, PlayStation" },
      { label: "Region", value: "Global / Region Free" }
    ],
    digitalAsset: {
      platform: "Multi",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Ve a roblox.com/redeem en tu navegador.\n2. Inicia sesión en tu cuenta de Roblox.\n3. Ingresa tu código y pulsa 'Canjear' para recibir tus 1,000 Robux.",
      activationInstructionsEn: "1. Go to roblox.com/redeem.\n2. Log into your Roblox account.\n3. Enter the code and click 'Redeem' to receive your 1,000 Robux."
    }
  }
];
