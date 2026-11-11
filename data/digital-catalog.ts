// Catálogo Oficial de Productos Digitales y Claves de Videojuegos de aldri.shop
// Modalidad: JIT (Just-In-Time Fulfillment con $0 Capital) + Activos Propios 100% Margen

export interface DigitalProductItem {
  name: string;
  nameEn: string;
  slug: string;
  sku: string;
  description: string;
  descriptionEn: string;
  price: number;
  compareAtPrice: number;
  productType: "digital";
  images: string[];
  stock: number;
  category: string;
  categoryEn: string;
  badge: string;
  badgeEn: string;
  isActive: boolean;
  features: Array<{ label: string; value: string }>;
  featuresEn: Array<{ label: string; value: string }>;
  digitalAsset: {
    platform: 'Steam' | 'Xbox' | 'PlayStation' | 'PC' | 'Nintendo' | 'Multi';
    keyDeliveryType: 'instant_key' | 'download_link' | 'activation_guide' | 'jit_key';
    fileUrl?: string;
    availableKeys?: string[];
    activationInstructions: string;
    activationInstructionsEn: string;
  };
}

export const REAL_DIGITAL_PRODUCTS: DigitalProductItem[] = [
  {
    name: "Cyberpunk 2077: Ultimate Edition - Clave Global Steam",
    nameEn: "Cyberpunk 2077: Ultimate Edition - Steam Global Key",
    slug: "cyberpunk-2077-ultimate-edition-steam-global-key",
    sku: "DIG-CYBERPUNK-ULT",
    description: "Incluye el juego base con todas las actualizaciones 2.0 y la aclamada expansión de espionaje Phantom Liberty. Canjeable directamente en tu biblioteca de Steam para PC sin restricciones de región.",
    descriptionEn: "Includes base game with update 2.0 and the Phantom Liberty spy-thriller expansion. Redeemable directly in your Steam PC library worldwide.",
    price: 34.99,
    compareAtPrice: 59.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Videojuegos & Game Keys",
    categoryEn: "Video Games & CD Keys",
    badge: "Bestseller 🔥",
    badgeEn: "Bestseller 🔥",
    isActive: true,
    features: [
      { label: "Plataforma", value: "PC (Steam)" },
      { label: "Región", value: "Global / Sin Restricciones" },
      { label: "Entrega", value: "Clave Digital Instantánea" }
    ],
    featuresEn: [
      { label: "Platform", value: "PC (Steam)" },
      { label: "Region", value: "Global / Region Free" },
      { label: "Delivery", value: "Instant Digital Key" }
    ],
    digitalAsset: {
      platform: "Steam",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Abre tu cliente Steam e inicia sesión.\n2. Haz clic en 'Añadir un juego' en la esquina inferior izquierda.\n3. Selecciona 'Activar un producto en Steam' e introduce la clave suministrada.",
      activationInstructionsEn: "1. Open Steam client and sign in.\n2. Click 'Add a Game' in bottom left.\n3. Select 'Activate a Product on Steam' and enter your license key."
    }
  },
  {
    name: "Elden Ring: Shadow of the Erdtree Edition - Clave Global Steam",
    nameEn: "Elden Ring: Shadow of the Erdtree Edition - Steam Global Key",
    slug: "elden-ring-shadow-of-the-erdtree-steam-key",
    sku: "DIG-ELDEN-SHADOW",
    description: "La obra maestra de FromSoftware ganadora de cientos de premios GOTY junto a la colosal expansión Shadow of the Erdtree. Clave digital oficial para Steam.",
    descriptionEn: "The critically acclaimed masterpiece by FromSoftware bundled with the colossal Shadow of the Erdtree expansion. Official Steam digital code.",
    price: 49.99,
    compareAtPrice: 79.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Videojuegos & Game Keys",
    categoryEn: "Video Games & CD Keys",
    badge: "GOTY Masterpiece",
    badgeEn: "GOTY Masterpiece",
    isActive: true,
    features: [
      { label: "Plataforma", value: "PC (Steam)" },
      { label: "Región", value: "Global" },
      { label: "Entrega", value: "Clave Digital Instantánea" }
    ],
    featuresEn: [
      { label: "Platform", value: "PC (Steam)" },
      { label: "Region", value: "Global" },
      { label: "Delivery", value: "Instant Digital Key" }
    ],
    digitalAsset: {
      platform: "Steam",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Inicia sesión en Steam.\n2. Selecciona Menú Juegos > Activar un producto en Steam.\n3. Pega tu clave de activación y completa la descarga.",
      activationInstructionsEn: "1. Sign in to Steam.\n2. Go to Games menu > Activate a Product on Steam.\n3. Paste your code to download."
    }
  },
  {
    name: "Grand Theft Auto V: Premium Online Edition - Clave PC",
    nameEn: "Grand Theft Auto V: Premium Online Edition - PC Key",
    slug: "gta-v-premium-online-edition-pc-key",
    sku: "DIG-GTAV-PREMIUM",
    description: "Incluye la trama completa de GTA V, acceso gratis a GTA Online y el Criminal Enterprise Starter Pack con valor superior a $10,000,000 de GTA$ en propiedades y vehículos.",
    descriptionEn: "Includes complete GTA V story, GTA Online access, and Criminal Enterprise Starter Pack with over $10,000,000 GTA$ in properties and vehicles.",
    price: 19.99,
    compareAtPrice: 39.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1552824792-ecab8a55c2f0?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Videojuegos & Game Keys",
    categoryEn: "Video Games & CD Keys",
    badge: "Popular 🚀",
    badgeEn: "Popular 🚀",
    isActive: true,
    features: [
      { label: "Plataforma", value: "PC (Rockstar Games / Steam)" },
      { label: "Contenido", value: "Juego Completo + Online + Starter Pack" },
      { label: "Entrega", value: "Digital Instantánea" }
    ],
    featuresEn: [
      { label: "Platform", value: "PC (Rockstar Games / Steam)" },
      { label: "Content", value: "Full Game + Online + Starter Pack" },
      { label: "Delivery", value: "Instant Digital" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Descarga el Rockstar Games Launcher o abre Steam.\n2. Haz clic en el icono de tu perfil y selecciona 'Canjear Código'.\n3. Introduce tu clave oficial para activar tu juego permanentemente.",
      activationInstructionsEn: "1. Open Rockstar Games Launcher or Steam.\n2. Go to profile icon > Redeem Code.\n3. Enter your activation code to link the game permanently."
    }
  },
  {
    name: "Red Dead Redemption 2 - Clave Global Steam",
    nameEn: "Red Dead Redemption 2 - Steam Global Key",
    slug: "red-dead-redemption-2-steam-global-key",
    sku: "DIG-RDR2-STEAM",
    description: "La épica historia de Arthur Morgan y la banda de Van der Linde en el salvaje oeste. Incluye acceso a Red Dead Online. Calidad gráfica ultra en PC con HDR y DLSS.",
    descriptionEn: "Arthur Morgan and the Van der Linde gang epic Western journey. Includes Red Dead Online. Ultimate PC graphics with HDR and DLSS support.",
    price: 24.99,
    compareAtPrice: 59.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Videojuegos & Game Keys",
    categoryEn: "Video Games & CD Keys",
    badge: "Top Rated ⭐",
    badgeEn: "Top Rated ⭐",
    isActive: true,
    features: [
      { label: "Plataforma", value: "PC (Steam)" },
      { label: "Idioma", value: "Español / Inglés / Multi" },
      { label: "Entrega", value: "Clave Digital" }
    ],
    featuresEn: [
      { label: "Platform", value: "PC (Steam)" },
      { label: "Language", value: "Multi-Language" },
      { label: "Delivery", value: "Digital Key" }
    ],
    digitalAsset: {
      platform: "Steam",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Inicia sesión en Steam.\n2. En el menú superior pulsa Productos > Activar producto en Steam.\n3. Ingresa tu código y descarga tu juego.",
      activationInstructionsEn: "1. Sign in to Steam.\n2. Open Games menu > Activate a Product on Steam.\n3. Enter your code to activate."
    }
  },
  {
    name: "Minecraft: Java & Bedrock Edition - Clave Oficial PC",
    nameEn: "Minecraft: Java & Bedrock Edition - Official PC Key",
    slug: "minecraft-java-and-bedrock-edition-pc-key",
    sku: "DIG-MINECRAFT-PC",
    description: "El bundle definitivo que incluye ambas versiones: Java Edition para mods infinitos y servidores comunitarios, más Bedrock Edition con juego cruzado en Windows, consolas y móviles.",
    descriptionEn: "The ultimate bundle containing both editions: Java Edition for endless mods and community servers, plus Bedrock Edition for cross-play across devices.",
    price: 22.99,
    compareAtPrice: 29.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Videojuegos & Game Keys",
    categoryEn: "Video Games & CD Keys",
    badge: "Clásico Global",
    badgeEn: "Global Classic",
    isActive: true,
    features: [
      { label: "Plataforma", value: "PC (Windows 10 / 11)" },
      { label: "Ediciones", value: "Java & Bedrock Incluidas" },
      { label: "Cuenta", value: "Vinculación directa Microsoft" }
    ],
    featuresEn: [
      { label: "Platform", value: "PC (Windows 10 / 11)" },
      { label: "Editions", value: "Java & Bedrock Included" },
      { label: "Account", value: "Direct Microsoft Account Link" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Ingresa a redeem.microsoft.com o abre Microsoft Store.\n2. Inicia sesión con tu cuenta de Microsoft.\n3. Pega el código de 25 caracteres para añadir Minecraft a tu biblioteca.",
      activationInstructionsEn: "1. Go to redeem.microsoft.com or open Microsoft Store.\n2. Sign in with your Microsoft account.\n3. Enter the 25-character code to link Minecraft to your account."
    }
  },
  {
    name: "Xbox Game Pass Ultimate - 1 Mes Suscripción Global",
    nameEn: "Xbox Game Pass Ultimate - 1 Month Global Subscription",
    slug: "xbox-game-pass-ultimate-1-month-global",
    sku: "DIG-XGPU-1M",
    description: "Acceso ilimitado a más de 400 juegos en consola Xbox, PC y Cloud Gaming en tu smartphone o tablet. Incluye EA Play, multijugador online Xbox Live Gold y recompensas exclusivas.",
    descriptionEn: "Unlimited access to over 400 games across Xbox, PC, and Cloud Gaming on mobile. Includes EA Play, online multiplayer, and member perks.",
    price: 14.99,
    compareAtPrice: 19.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Suscripciones & Gift Cards",
    categoryEn: "Subscriptions & Gift Cards",
    badge: "Super Valor 🌟",
    badgeEn: "Super Value 🌟",
    isActive: true,
    features: [
      { label: "Duración", value: "1 Mes Completo" },
      { label: "Plataforma", value: "Xbox Series X|S, Xbox One, PC, Cloud" },
      { label: "Beneficios", value: "EA Play + Multijugador Online" }
    ],
    featuresEn: [
      { label: "Duration", value: "1 Full Month" },
      { label: "Platform", value: "Xbox Series X|S, One, PC, Cloud" },
      { label: "Perks", value: "EA Play + Online Multiplayer" }
    ],
    digitalAsset: {
      platform: "Xbox",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Ve a redeem.microsoft.com desde tu navegador o abre la app Xbox en tu consola/PC.\n2. Introduce el código digital y confirma la activación.",
      activationInstructionsEn: "1. Visit redeem.microsoft.com or open Xbox app.\n2. Enter the 25-character token and confirm activation."
    }
  },
  {
    name: "Windows 11 Professional OEM Key - Activación de Por Vida",
    nameEn: "Windows 11 Professional OEM Key - Lifetime Activation",
    slug: "windows-11-professional-oem-key-lifetime",
    sku: "DIG-WIN11-PRO",
    description: "Clave de activación digital oficial de por vida para Windows 11 Pro (64 bits). Desbloquea BitLocker, Escritorio Remoto, Hyper-V, Sandbox y la máxima velocidad de tu hardware.",
    descriptionEn: "Official lifetime activation key for Windows 11 Pro 64-bit. Unlocks BitLocker, Remote Desktop, Hyper-V, Sandbox, and maximum hardware performance.",
    price: 24.99,
    compareAtPrice: 199.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Licenses",
    badge: "90% OFF 🔥",
    badgeEn: "90% OFF 🔥",
    isActive: true,
    features: [
      { label: "Tipo Licencia", value: "OEM Digital de Por Vida (1 PC)" },
      { label: "Arquitectura", value: "32/64 bits (Multilenguaje)" },
      { label: "Actualizaciones", value: "Oficiales de Microsoft de por vida" }
    ],
    featuresEn: [
      { label: "License Type", value: "Lifetime OEM Digital (1 PC)" },
      { label: "Architecture", value: "32/64 bits (Multi-language)" },
      { label: "Updates", value: "Lifetime Official Microsoft Updates" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Abre Configuración > Sistema > Activación en Windows 11.\n2. Haz clic en 'Cambiar la clave de producto'.\n3. Ingresa tu clave de 25 caracteres y pulsa Activar.",
      activationInstructionsEn: "1. Open Settings > System > Activation in Windows 11.\n2. Click 'Change product key'.\n3. Enter the 25-character key and click Activate."
    }
  },
  {
    name: "Microsoft 365 Personal - Licencia Digital 1 Año",
    nameEn: "Microsoft 365 Personal - 1 Year Digital License",
    slug: "microsoft-365-personal-1-year-license",
    sku: "DIG-M365-1Y",
    description: "Suscripción oficial de 12 meses para 1 usuario en hasta 5 dispositivos simultáneos (PC, Mac, iOS, Android). Incluye Word, Excel, PowerPoint, Outlook y 1 TB de almacenamiento en la nube OneDrive.",
    descriptionEn: "Official 12-month subscription for 1 user across 5 devices (PC, Mac, iOS, Android). Includes Word, Excel, PowerPoint, Outlook, and 1 TB OneDrive cloud storage.",
    price: 49.99,
    compareAtPrice: 69.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Licenses",
    badge: "Oficial Microsoft",
    badgeEn: "Official Microsoft",
    isActive: true,
    features: [
      { label: "Duración", value: "1 Año (12 Meses)" },
      { label: "Almacenamiento", value: "1 TB OneDrive Seguro" },
      { label: "Dispositivos", value: "Hasta 5 a la vez (PC/Mac/Móvil)" }
    ],
    featuresEn: [
      { label: "Duration", value: "1 Year (12 Months)" },
      { label: "Cloud Storage", value: "1 TB Secure OneDrive" },
      { label: "Devices", value: "Up to 5 simultaneous devices" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Ve a setup.office.com con tu cuenta de Microsoft.\n2. Ingresa la clave digital adquirida.\n3. Descarga las aplicaciones oficiales de Office en tu equipo.",
      activationInstructionsEn: "1. Visit setup.office.com with your Microsoft account.\n2. Enter the purchased digital product key.\n3. Download the official Office apps to your computer."
    }
  },
  {
    name: "Notion Luxury OS - Sistema Maestro de Productividad & Finanzas",
    nameEn: "Notion Luxury OS - Master Productivity & Wealth System",
    slug: "notion-luxury-os-master-system",
    sku: "DIG-NOTION-LUX",
    description: "La suite definitiva en Notion con diseño minimalista Obsidian & Gold. Incluye gestor de proyectos, control de flujo de caja, tracking de hábitos de alto rendimiento y diario de trading.",
    descriptionEn: "The ultimate Notion system styled in minimalist Obsidian & Gold. Features executive project tracker, personal wealth cash-flow manager, habit tracker, and trading journal.",
    price: 29.99,
    compareAtPrice: 79.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Activos Digitales & Plantillas",
    categoryEn: "Digital Assets & Templates",
    badge: "Exclusivo Aldri ✨",
    badgeEn: "Aldri Exclusive ✨",
    isActive: true,
    features: [
      { label: "Formato", value: "Plantilla Oficial de Notion" },
      { label: "Acceso", value: "Duplicación Inmediata con 1 Clic" },
      { label: "Margen", value: "100% Digital y Actualizaciones Gratuitas" }
    ],
    featuresEn: [
      { label: "Format", value: "Official Notion Template" },
      { label: "Access", value: "Instant 1-Click Duplicate" },
      { label: "Updates", value: "Lifetime Free Version Updates" }
    ],
    digitalAsset: {
      platform: "Multi",
      keyDeliveryType: "download_link",
      fileUrl: "https://notion.so/aldri-luxury-os-template-access",
      activationInstructions: "1. Abre el enlace de la plantilla suministrado tras la compra.\n2. Pulsa el botón 'Duplicar' en la esquina superior derecha de Notion.\n3. Empieza a gestionar tus proyectos y finanzas inmediatamente.",
      activationInstructionsEn: "1. Open the Notion template link provided after checkout.\n2. Click the 'Duplicate' button in top-right corner of Notion.\n3. Start managing your wealth and tasks right away."
    }
  },
  {
    name: "Obsidian Sound LAB - Master LUTs & Presets para Creadores",
    nameEn: "Obsidian Sound LAB - Master LUTs & Presets for Creators",
    slug: "obsidian-sound-lab-master-luts-presets",
    sku: "DIG-OBSIDIAN-LAB",
    description: "Colección profesional de 25 LUTs cinematográficas para Premiere, Final Cut y DaVinci Resolve, más 15 presets de ecualización para streamers de Twitch, podcasters y YouTubers.",
    descriptionEn: "Professional collection of 25 cinematic LUTs for Premiere, Final Cut, and DaVinci Resolve, plus 15 broadcast audio presets for Twitch streamers and podcasters.",
    price: 19.99,
    compareAtPrice: 49.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Activos Digitales & Plantillas",
    categoryEn: "Digital Assets & Templates",
    badge: "Para Creadores 🎙️",
    badgeEn: "For Creators 🎙️",
    isActive: true,
    features: [
      { label: "Compatibilidad", value: "Premiere, DaVinci, OBS, Audition" },
      { label: "Archivos", value: ".CUBE (LUTs) + .WAV / Presets DSP" },
      { label: "Entrega", value: "Descarga Directa Cifrada" }
    ],
    featuresEn: [
      { label: "Compatibility", value: "Premiere, DaVinci, OBS, Audition" },
      { label: "Files", value: ".CUBE (LUTs) + DSP Presets" },
      { label: "Delivery", value: "Encrypted Direct Download" }
    ],
    digitalAsset: {
      platform: "Multi",
      keyDeliveryType: "download_link",
      fileUrl: "https://aldri.shop/downloads/obsidian-sound-lab-pack.zip",
      activationInstructions: "1. Descarga el archivo ZIP desde tu panel de confirmación.\n2. Descomprime e importa los archivos .cube en tu editor de video o software de audio.\n3. Aplica los perfiles con un solo clic.",
      activationInstructionsEn: "1. Download the ZIP package from your confirmation screen.\n2. Unzip and import the .cube files into your video editor or DAW.\n3. Apply presets with a single click."
    }
  }
];
