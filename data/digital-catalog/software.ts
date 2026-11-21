import { DigitalProductItem } from "./types";

export const DIGITAL_SOFTWARE: DigitalProductItem[] = [
  {
    name: "Windows 11 Pro OEM - Clave Oficial Permanente para 1 PC",
    nameEn: "Windows 11 Pro OEM - Official Lifetime License Key",
    slug: "windows-11-pro-oem-lifetime-key",
    sku: "DIG-WIN11-PRO",
    description: "Clave original OEM de 25 caracteres para activar Windows 11 Pro de forma permanente de por vida. Habilita BitLocker, Escritorio Remoto, Sandbox y todas las funciones empresariales.",
    descriptionEn: "Official OEM 25-character activation key for lifetime Windows 11 Pro. Enables BitLocker, Remote Desktop, Sandbox, and all enterprise security features.",
    price: 14.99,
    compareAtPrice: 199.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "92% OFF Vitalicio 💻",
    badgeEn: "92% OFF Lifetime 💻",
    isActive: true,
    features: [
      { label: "Tipo", value: "Licencia OEM Digital Oficial" },
      { label: "Duración", value: "Permanente de por vida (Sin suscripciones)" },
      { label: "Activación", value: "Servidores Oficiales de Microsoft" }
    ],
    featuresEn: [
      { label: "Type", value: "Official Digital OEM License" },
      { label: "Duration", value: "Permanent Lifetime (No subscriptions)" },
      { label: "Activation", value: "Official Microsoft Servers" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Ve a Configuración de Windows -> Sistema -> Activación.\n2. Haz clic en 'Cambiar la clave de producto'.\n3. Ingresa tu clave de 25 caracteres y pulsa Activar.",
      activationInstructionsEn: "1. Go to Windows Settings -> System -> Activation.\n2. Click 'Change product key'.\n3. Enter the 25-digit key and click Activate."
    }
  },
  {
    name: "Windows 10 Pro OEM - Clave Oficial Permanente para 1 PC",
    nameEn: "Windows 10 Pro OEM - Official Lifetime License Key",
    slug: "windows-10-pro-oem-lifetime-key",
    sku: "DIG-WIN10-PRO",
    description: "Licencia oficial para activar Windows 10 Pro de por vida. Incluye soporte para actualización gratuita a Windows 11 Pro cuando lo desees.",
    descriptionEn: "Official lifetime activation key for Windows 10 Pro. Includes eligible free upgrade path to Windows 11 Pro anytime.",
    price: 12.99,
    compareAtPrice: 149.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Vitalicio Garantizado ⚡",
    badgeEn: "Lifetime Guaranteed ⚡",
    isActive: true,
    features: [
      { label: "Tipo", value: "Clave OEM Digital" },
      { label: "Idioma", value: "Multilenguaje (Español, Inglés, etc.)" },
      { label: "Arquitectura", value: "32 y 64 Bits" }
    ],
    featuresEn: [
      { label: "Type", value: "Digital OEM Key" },
      { label: "Language", value: "Multi-language Worldwide" },
      { label: "Architecture", value: "32 & 64 Bit Compatible" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. En Windows, ve a Configuración -> Actualización y seguridad -> Activación.\n2. Introduce la clave suministrada.\n3. Activación instantánea en línea.",
      activationInstructionsEn: "1. Go to Settings -> Update & Security -> Activation.\n2. Enter provided key.\n3. Instant online activation."
    }
  },
  {
    name: "Microsoft Office 2024 Professional Plus - Licencia Permanente",
    nameEn: "Microsoft Office 2024 Professional Plus - Lifetime License",
    slug: "microsoft-office-2024-professional-plus-key",
    sku: "DIG-OFFICE-2024",
    description: "La suite de productividad más avanzada sin pagos mensuales. Incluye Word, Excel, PowerPoint, Outlook, Access y OneNote 2024 activados de por vida para 1 PC.",
    descriptionEn: "The newest productivity suite with zero monthly subscription fees. Includes Word, Excel, PowerPoint, Outlook, Access, and OneNote 2024 permanently.",
    price: 24.99,
    compareAtPrice: 249.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Sin Mensualidades 💼",
    badgeEn: "Zero Monthly Fees 💼",
    isActive: true,
    features: [
      { label: "Apps", value: "Word, Excel, PowerPoint, Outlook, Access, OneNote" },
      { label: "Suscripción", value: "Ninguna (Pago único de por vida)" },
      { label: "Compatibilidad", value: "Windows 10 y Windows 11" }
    ],
    featuresEn: [
      { label: "Apps", value: "Word, Excel, PowerPoint, Outlook, Access, OneNote" },
      { label: "Subscription", value: "None (One-time payment for life)" },
      { label: "Compatibility", value: "Windows 10 & Windows 11" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Descarga el instalador oficial desde setup.office.com.\n2. Inicia sesión con tu cuenta de Microsoft e introduce la clave del producto.\n3. Descarga la suite y utilízala para siempre.",
      activationInstructionsEn: "1. Download official installer from setup.office.com.\n2. Sign in with your Microsoft account and enter your product key.\n3. Install and use forever."
    }
  },
  {
    name: "Microsoft Office 2021 Professional Plus - Licencia Permanente",
    nameEn: "Microsoft Office 2021 Professional Plus - Lifetime License",
    slug: "microsoft-office-2021-professional-plus-key",
    sku: "DIG-OFFICE-2021",
    description: "Versión probada y ultraestable de Office para profesionales, estudiantes y empresas. Pago único definitivo sin cargos recurrentes.",
    descriptionEn: "Stable and trusted Office suite for professionals, students, and businesses. One-time purchase with zero recurring charges.",
    price: 19.99,
    compareAtPrice: 199.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "90% OFF 📊",
    badgeEn: "90% OFF 📊",
    isActive: true,
    features: [
      { label: "Licencia", value: "Vitalicia para 1 PC" },
      { label: "Idioma", value: "Español e Inglés Oficial" },
      { label: "Descarga", value: "Directa desde Servidores Microsoft" }
    ],
    featuresEn: [
      { label: "License", value: "Lifetime for 1 PC" },
      { label: "Language", value: "Worldwide Multi-language" },
      { label: "Download", value: "Direct from Microsoft CDN" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Ve a setup.office.com.\n2. Ingresa tu clave y asóciala a tu cuenta.\n3. Instala y activa en tu PC.",
      activationInstructionsEn: "1. Go to setup.office.com.\n2. Enter product key.\n3. Install and enjoy."
    }
  },
  {
    name: "Microsoft 365 Personal (Suscripción 1 Año) + 1TB OneDrive",
    nameEn: "Microsoft 365 Personal (1-Year Subscription) + 1TB Cloud",
    slug: "microsoft-365-personal-1-year-key",
    sku: "DIG-M365-1YR",
    description: "Acceso oficial a las versiones más recientes de Word, Excel, PowerPoint y Outlook para PC, Mac, iPad y móviles, con 1 TB (1,000 GB) de almacenamiento en la nube de OneDrive.",
    descriptionEn: "Official 1-year access to latest premium Office apps for PC, Mac, iPad, and mobile devices, plus 1 TB secure OneDrive cloud storage.",
    price: 39.99,
    compareAtPrice: 69.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Incluye 1TB Cloud ☁️",
    badgeEn: "Includes 1TB Cloud ☁️",
    isActive: true,
    features: [
      { label: "Dispositivos", value: "Hasta 5 Dispositivos Simultáneos" },
      { label: "Nube", value: "1,000 GB OneDrive Protegido" },
      { label: "Sistemas", value: "Windows, macOS, iOS y Android" }
    ],
    featuresEn: [
      { label: "Devices", value: "Up to 5 Simultaneous Devices" },
      { label: "Cloud", value: "1,000 GB Encrypted OneDrive" },
      { label: "Systems", value: "Windows, macOS, iOS, Android" }
    ],
    digitalAsset: {
      platform: "Multi",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Visita microsoft365.com/setup.\n2. Inicia sesión con tu cuenta Microsoft.\n3. Ingresa la clave para sumar 1 año de suscripción activa.",
      activationInstructionsEn: "1. Visit microsoft365.com/setup.\n2. Sign in with your account.\n3. Enter key to extend subscription by 1 full year."
    }
  },
  {
    name: "Windows Server 2022 Standard - Clave Original 16 Cores",
    nameEn: "Windows Server 2022 Standard - 16 Cores Original Key",
    slug: "windows-server-2022-standard-key",
    sku: "DIG-WIN-SRV-2022",
    description: "La plataforma de servidor empresarial de Microsoft con seguridad multicapa avanzada, capacidades híbridas con Azure y virtualización Hyper-V.",
    descriptionEn: "Enterprise server operating system featuring advanced multi-layer security, hybrid cloud capabilities with Azure, and Hyper-V virtualization.",
    price: 49.99,
    compareAtPrice: 499.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Empresarial 🏢",
    badgeEn: "Enterprise 🏢",
    isActive: true,
    features: [
      { label: "Núcleos", value: "Hasta 16 Cores Soportados" },
      { label: "Virtualización", value: "2 Máquinas Virtuales Hyper-V" },
      { label: "Duración", value: "Licencia Perpetua" }
    ],
    featuresEn: [
      { label: "Cores", value: "Up to 16 Cores Supported" },
      { label: "Virtualization", value: "2 Hyper-V Virtual Machines" },
      { label: "Duration", value: "Perpetual License" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Abre PowerShell como Administrador en tu servidor.\n2. Ejecuta: slmgr.vbs /ipk TU_CLAVE_AQUI\n3. slmgr.vbs /ato para activación instantánea.",
      activationInstructionsEn: "1. Open PowerShell as Admin on your server.\n2. Run: slmgr.vbs /ipk YOUR_KEY_HERE\n3. Run: slmgr.vbs /ato to activate immediately."
    }
  },
  {
    name: "NordVPN - Suscripción Premium 2 Años (Protección Total)",
    nameEn: "NordVPN Premium 2-Year Subscription (Total Security)",
    slug: "nordvpn-premium-2-years-subscription",
    sku: "DIG-NORDVPN-2YR",
    description: "La VPN #1 en velocidad y privacidad según analistas de ciberseguridad. Servidores en más de 110 países, protección contra malware y hasta 10 dispositivos simultáneos.",
    descriptionEn: "The top-rated ultra fast VPN. Servers in 110+ countries, Threat Protection anti-malware, and support for up to 10 devices simultaneously.",
    price: 49.99,
    compareAtPrice: 149.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "VPN Más Rápida 🛡️",
    badgeEn: "Fastest VPN 🛡️",
    isActive: true,
    features: [
      { label: "Dispositivos", value: "10 Conexiones a la Vez" },
      { label: "Duración", value: "2 Años de Acceso Ilimitado" },
      { label: "Servidores", value: "6,400+ Servidores Ultrarrápidos" }
    ],
    featuresEn: [
      { label: "Devices", value: "10 Simultaneous Connections" },
      { label: "Duration", value: "2 Full Years Unlimited" },
      { label: "Servers", value: "6,400+ High Speed Servers" }
    ],
    digitalAsset: {
      platform: "Multi",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Entra en nordvpn.com/activate.\n2. Inicia sesión o crea una cuenta e introduce tu código de canje.\n3. Disfruta de privacidad total durante 24 meses.",
      activationInstructionsEn: "1. Visit nordvpn.com/activate.\n2. Log into your account and enter redemption code.\n3. Enjoy total security for 24 months."
    }
  },
  {
    name: "Surfshark VPN - Suscripción 1 Año (Dispositivos Ilimitados)",
    nameEn: "Surfshark VPN - 1-Year Unlimited Devices Subscription",
    slug: "surfshark-vpn-1-year-subscription",
    sku: "DIG-SURFSHARK-1YR",
    description: "Navega seguro con conexiones simultáneas ilimitadas en todos los dispositivos de tu hogar. Incluye bloqueador de anuncios CleanWeb y modo camuflaje.",
    descriptionEn: "Browse securely with unlimited simultaneous devices for your entire household. Includes CleanWeb ad blocker and camouflage mode.",
    price: 34.99,
    compareAtPrice: 79.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Dispositivos Ilimitados 🌊",
    badgeEn: "Unlimited Devices 🌊",
    isActive: true,
    features: [
      { label: "Conexiones", value: "Ilimitadas (Toda la Familia)" },
      { label: "AdBlock", value: "CleanWeb Bloqueador de Anuncios y Rastreadores" },
      { label: "Garantía", value: "Cero Registros (No-Logs Auditada)" }
    ],
    featuresEn: [
      { label: "Connections", value: "Unlimited Devices" },
      { label: "AdBlock", value: "CleanWeb Built-in Ad Blocker" },
      { label: "Privacy", value: "Audited 100% No-Logs Policy" }
    ],
    digitalAsset: {
      platform: "Multi",
      keyDeliveryType: "jit_key",
      activationInstructions: "1. Abre surfshark.com/redeem.\n2. Escribe el código de licencia.\n3. Instala la app en todos tus teléfonos, TVs y computadoras.",
      activationInstructionsEn: "1. Go to surfshark.com/redeem.\n2. Enter your license code.\n3. Install on unlimited devices."
    }
  },
  {
    name: "Kaspersky Total Security - 1 Dispositivo (Licencia 1 Año)",
    nameEn: "Kaspersky Total Security - 1 Device 1-Year License",
    slug: "kaspersky-total-security-1-year-key",
    sku: "DIG-KASPERSKY-1YR",
    description: "Protección galardonada contra virus, ransomware, phishing y troyanos. Incluye firewall bidireccional y navegación bancaria segura Safe Money.",
    descriptionEn: "Award-winning protection against malware, ransomware, and phishing. Includes two-way firewall and Safe Money secure banking browser.",
    price: 18.99,
    compareAtPrice: 44.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Antivirus Líder 🛡️",
    badgeEn: "Top Antivirus 🛡️",
    isActive: true,
    features: [
      { label: "Protección", value: "Tiempo Real contra Ransomware y Phishing" },
      { label: "Duración", value: "1 Año Completo de Actualizaciones" },
      { label: "Compatibilidad", value: "Windows 11 / 10 / Mac / Android" }
    ],
    featuresEn: [
      { label: "Protection", value: "Real-time Ransomware & Phishing Defense" },
      { label: "Duration", value: "1 Full Year of Database Updates" },
      { label: "Compatibility", value: "Windows / Mac / Android" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Abre la aplicación de Kaspersky en tu equipo.\n2. Haz clic en 'Introducir código de activación'.\n3. Ingresa la clave suministrada.",
      activationInstructionsEn: "1. Open Kaspersky.\n2. Click 'Enter activation code'.\n3. Enter the provided key."
    }
  },
  {
    name: "Bitdefender Total Security 2026 - 3 Dispositivos (1 Año)",
    nameEn: "Bitdefender Total Security 2026 - 3 Devices 1-Year",
    slug: "bitdefender-total-security-3-devices-1-year",
    sku: "DIG-BITDEFENDER-3DEV",
    description: "Cero impacto en el rendimiento de tu PC con la máxima puntuación en detección de amenazas. Protege hasta 3 dispositivos simultáneos (Windows, Mac, iOS, Android).",
    descriptionEn: "Zero performance slowdown with top malware detection rates. Protect up to 3 devices across Windows, macOS, iOS, and Android.",
    price: 21.99,
    compareAtPrice: 59.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "3 Dispositivos 🔐",
    badgeEn: "3 Devices 🔐",
    isActive: true,
    features: [
      { label: "Dispositivos", value: "3 PCs, Macs o Smartphones" },
      { label: "Rendimiento", value: "Modo Juego y Modo Trabajo Automático" },
      { label: "Vigencia", value: "365 Días de Protección Total" }
    ],
    featuresEn: [
      { label: "Devices", value: "3 PCs, Macs, or Phones" },
      { label: "Performance", value: "Auto Gaming & Work Modes" },
      { label: "Duration", value: "365 Days Complete Protection" }
    ],
    digitalAsset: {
      platform: "Multi",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Entra a central.bitdefender.com.\n2. Haz clic en 'Mis suscripciones' -> 'Activar con código'.\n3. Descarga la protección en tus 3 equipos.",
      activationInstructionsEn: "1. Visit central.bitdefender.com.\n2. Click 'My Subscriptions' -> 'Activate with code'.\n3. Download on up to 3 devices."
    }
  },
  {
    name: "Malwarebytes Premium - Licencia Oficial 1 Año para 1 PC",
    nameEn: "Malwarebytes Premium - Official 1-Year PC License",
    slug: "malwarebytes-premium-1-year-pc-key",
    sku: "DIG-MALWAREBYTES-1YR",
    description: "El destructor definitivo de spyware, adware y malware persistente que los antivirus tradicionales no detectan. Protección web en tiempo real.",
    descriptionEn: "The premier defense against spyware, aggressive adware, and persistent rootkits that bypass traditional antivirus. Real-time web shielding.",
    price: 16.99,
    compareAtPrice: 44.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 99,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Anti-Malware #1 👾",
    badgeEn: "#1 Anti-Malware 👾",
    isActive: true,
    features: [
      { label: "Especialidad", value: "Detección de Spyware, Adware y Troyanos" },
      { label: "Protección", value: "Navegación Web Segura y Anti-Exploit" },
      { label: "Duración", value: "1 Año de Licencia Oficial" }
    ],
    featuresEn: [
      { label: "Specialty", value: "Deep Spyware, Adware & Trojan Removal" },
      { label: "Defense", value: "Anti-Exploit and Malicious Web Shield" },
      { label: "Duration", value: "1 Year Official License" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Abre Malwarebytes en tu computadora.\n2. Haz clic en 'Activar licencia'.\n3. Ingresa tu clave y pulsa Activar.",
      activationInstructionsEn: "1. Open Malwarebytes on PC.\n2. Click 'Activate License'.\n3. Enter your key and activate."
    }
  },
  {
    name: "Internet Download Manager (IDM) - Licencia Vitalicia Oficial para 1 PC",
    nameEn: "Internet Download Manager (IDM) - Lifetime Official PC Key",
    slug: "internet-download-manager-idm-lifetime-key",
    sku: "DIG-IDM-LIFETIME",
    description: "Multiplica la velocidad de tus descargas hasta 5 veces con aceleración segmentada inteligente. Compatible con Chrome, Edge, Firefox y Brave de por vida.",
    descriptionEn: "Accelerate your downloads up to 5 times with dynamic smart file segmentation. Seamless integration with Chrome, Edge, and Firefox forever.",
    price: 14.99,
    compareAtPrice: 29.99,
    productType: "digital",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"
    ],
    stock: 999,
    category: "Software & Licencias",
    categoryEn: "Software & Operating Systems",
    badge: "Descargas 5X 🚀",
    badgeEn: "5X Downloads 🚀",
    isActive: true,
    features: [
      { label: "Velocidad", value: "Aceleración de Descargas hasta 500%" },
      { label: "Duración", value: "Licencia Vitalicia Permanente" },
      { label: "Navegadores", value: "Chrome, Edge, Firefox, Brave, Opera" }
    ],
    featuresEn: [
      { label: "Speed", value: "Up to 500% Download Acceleration" },
      { label: "Duration", value: "Lifetime License" },
      { label: "Browsers", value: "Chrome, Edge, Firefox, Brave, Opera" }
    ],
    digitalAsset: {
      platform: "PC",
      keyDeliveryType: "instant_key",
      activationInstructions: "1. Descarga IDM desde internetdownloadmanager.com.\n2. Ve a Registro -> Registro en la barra superior.\n3. Ingresa tus datos y el número de serie oficial proporcionado.",
      activationInstructionsEn: "1. Download IDM from internetdownloadmanager.com.\n2. Go to Registration -> Registration.\n3. Enter your details and the provided official serial key."
    }
  }
];
