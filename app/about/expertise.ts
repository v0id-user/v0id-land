export interface TechInfo {
    name: string;
    url: string;
    description: string;
    color: string;
}

export const languages: TechInfo[] = [
    {
        name: "C",
        url: "https://en.wikipedia.org/wiki/C_(programming_language)",
        description: "لغة عامة استخدمها كـ interface للغات الأخرى، تمنحني تحكم كامل في ال Binary operations مع ABI متوافق مع جميع اللغات",
        color: "bg-gray-600"
    },
    {
        name: "Assembly",
        url: "https://en.wikipedia.org/wiki/Assembly_language",
        description: "لغة low-level تساعدني في فهم كيفية عمل الأنظمة على مستوى الآلة بشكل مقروء للإنسان",
        color: "bg-red-950"
    },
    {
        name: "Python",
        url: "https://python.org",
        description: "لغتي المفضلة للمشاريع التي تحتاج سرعة في التطوير والتسليم، مثالية للـ rapid prototyping والـ MVPs",
        color: "bg-blue-500"
    },
    {
        name: "Go",
        url: "https://go.dev",
        description: "أعتمد عليها لبناء تطبيقات تتطلب تنفيذ عمليات متزامنة (Concurrency) بشكل مكثف، حيث أستفيد من الـ Go Routines الخفيفة والفعالة.",
        color: "bg-blue-500"
    },
    {
        name: "TypeScript",
        url: "https://www.typescriptlang.org",
        description: "لغتي الأساسية لكل ما يتعلق بالـ UI/UX وتطوير الواجهات، defacto-standard للـ frontend development",
        color: "bg-blue-600"
    },
];

export const libraries: TechInfo[] = [
    {
        name: "Prisma ORM",
        url: "https://www.prisma.io",
        description: "مكتبة ORM متكاملة لمشاريع TypeScript، يوفر type-safety وأدوات متقدمة للتعامل مع قواعد البيانات",
        color: "bg-purple-600"
    },
    {
        name: "React",
        url: "https://react.dev",
        description: "مكتبة تستخدم لبناء الواجهات الرسومية تم صنعها بواسطة Meta, هذه المكتبة تستخدم الان وبشكل واسع في المشاريع التي تحتاج الى UI/UX وهي اصبحت de-facto standard للـ frontend development",
        color: "bg-blue-600"
    }
];

export const frameworks: TechInfo[] = [
    {
        name: "Next.js",
        url: "https://nextjs.org",
        description: "إطار عملي المفضل لمشاريع الويب التي لا تتطلب backend معقد، يوفر حلول متكاملة للـ SSR و API routes",
        color: "bg-black"
    },
    {
        name: "Django",
        url: "https://www.djangoproject.com",
        description: "إطار عمل مثالي للمشاريع على مستوى enterprise، أستخدمه عندما أحتاج هيكلة قوية وopinionated architecture",
        color: "bg-[#0C4B33]"
    },
    {
        name: "Gin",
        url: "https://gin-gonic.com",
        description: "إطار عمل Go سريع يُستخدم لبناء REST APIs، يتميز بأدائه العالي وسهولة استخدامه. يناسب التطبيقات التي تحتاج إلى خدمات خلفية فعالة، بالإضافة إلى دعمه لاستخدام Templates، مما يتيح تصميم واجهات المستخدم بسهولة.",
        color: "bg-green-600"
    },
    {
        name: "Fiber",
        url: "https://gofiber.io/",
        description: "إطار عمل Go سريع للغاية وخفيف للغاية بسبب اعتمادة على الStack في تخزين الContext الخاص بكل Request، يتشابه في طريقته مع Express.js، مثالي للـ microservices والـ REST APIs",
        color: "bg-blue-600"
    }
];

export const databases: TechInfo[] = [
    {
        name: "PostgreSQL",
        url: "https://www.postgresql.org",
        description: "قاعدة بيانات قوية وقابلة للتوسيع مع extensions متعددة، تدعم الـ realtime والـ JSON وأنواع بيانات متقدمة",
        color: "bg-blue-700"
    },
    {
        name: "Redis",
        url: "https://redis.io",
        description: "أستخدمه للـ caching وأنظمة الـ pub/sub للرسائل الفورية، وكذلك كـ queue system للمهام الخلفية",
        color: "bg-red-600"
    }
];

export const cloudServices: TechInfo[] = [
    {
        name: "Tigris",
        url: "https://www.tigrisdata.com",
        description: "خدمة تخزين سحابية متكاملة مع ال S3 لكن بمميزات مثل التوزيع التلقائي على عدة نقاط حول العالم من نقطة النشر",
        color: "bg-green-400"
    },
    {
        name: "Cloudflare",
        url: "https://www.cloudflare.com",
        description: "خدمة توفر خدمات الـ CDN والـ DNS والـ DDoS protection والـ Web Application Firewall",
        color: "bg-orange-600"
    },
    {
        name: "Vercel",
        url: "https://vercel.com",
        description: "منصة سحابية متخصصة في استضافة تطبيقات الويب، تتميز بدعمها الممتاز لـ Next.js وتقنيات الويب الحديثة. توفر نظام Serverless Functions مع شبكة Edge عالمية تضمن سرعة استجابة عالية. تدعم النشر التلقائي من Git وتوفر أدوات تحليل الأداء المتقدمة",
        color: "bg-black"
    },
    {
        name: "Railway",
        url: "https://railway.app",
        description: "منصة سحابية مبسطة تركز على تجربة المطور(UX)، تدعم نشر التطبيقات بمختلف التقنيات والـ databases بسهولة. مثالية للـ microservices والتطبيقات التي تحتاج إلى صنع بيئة متكاملة بمتكلفات بسيطة. تتميز بواجهة سهلة الاستخدام وإعداد تلقائي للبيئات، لكن نقاط التواجد محدودة في الأمريكتين",
        color: "bg-purple-600"
    },
    {
        name: "Fly.io",
        url: "https://fly.io",
        description: "منصة سحابية متقدمة تجمع بين مرونة الاستضافة التقليدية وسهولة الخدمات السحابية الحديثة. تتميز بدعم Docker والـ GPUs للذكاء الاصطناعي، مع شبكة عالمية من مراكز البيانات. توفر خيارات متعددة للنشر سواء Serverless أو VM مع أداء عالي وتحكم كامل",
        color: "bg-purple-600"
    }
];

export const tools: TechInfo[] = [
    {
        name: "VSCode",
        url: "https://code.visualstudio.com",
        description: "بيئة التطوير الأساسية، غنية بالـ extensions وتدعم جميع اللغات والأدوات التي أستخدمها",
        color: "bg-blue-500"
    },
    {
        name:"Docker",
        url:"https://www.docker.com",
        description:"أداة تستخدم لإنشاء وتشغيل وإدارة الأنظمة المطلوبة لتطبيقك، مثالية للـ microservices و لجميع تطبيقاتك حيث هي تقوم بتجميع تطبيقك بأكمله في حاوية صغيرة تسهل النقل والتطوير",
        color:"bg-blue-600"
    },
    {
        name:"Git",
        url:"https://git-scm.com",
        description:"أداة تستخدم لإدارة التطوير والتحديثات في المشاريع",
        color:"bg-orange-600"
    },
    {
        name:"Hoppscotch",
        url:"https://hoppscotch.io",
        description:"أداة تستخدم لتجربة الـ APIs والـ endpoints, مفتوح المصدر ويحفظ عملك على الجهاز مباشرة",
        color:"bg-green-800"
    }
];

export const lifeTools: TechInfo[] = [
    {
        name:"Figma",
        url:"https://figma.com",
        description:"برنامج من أجل تصميم الواجهات الرسومية, وايضا القرافكس بشكل عام لكن على ايطار شبه محدود",
        color:"bg-purple-600"
    },
    {
        name: "Notion",
        url:"https://notion.so",
        description:"برنامج من أجل الـ note taking والـ project management والـ task tracking",
        color:"bg-black"
    }
];