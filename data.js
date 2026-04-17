/**
 * ============================================================
 *  WETÉ — ملف البيانات القابلة للتعديل
 * ============================================================
 *
 *  🔧 كيفية التعديل:
 *
 *  ➡️ لإضافة محطة: أضف كائناً جديداً في مصفوفة stations
 *  ➡️ لتغيير صورة محطة: غيّر قيمة image (مسار الصورة)
 *  ➡️ لتغيير الأسعار: عدّل price في كل نوع وقود
 *  ➡️ لإزالة نوع وقود: ضع available: false
 *  ➡️ لإضافة بنك: أضف كائناً في مصفوفة banks
 * ============================================================
 */

// ============================================================
//  محطات الوقود — أضف أو عدّل حسب رغبتك
// ============================================================
const stations = [

  {
    id: 1,
    name: "محطة النور",                     // ⬅️ اسم المحطة
    location: "نواكشوط — حي التيارت",        // ⬅️ موقع المحطة
    image: "",                               // ⬅️ مسار الصورة مثل: "images/station1.jpg"
    emoji: "⛽",                             // ⬅️ أيقونة تظهر إذا لم توجد صورة
    rating: "4.8 ★",                        // ⬅️ التقييم
    isOpen: true,                            // ⬅️ true = مفتوح | false = مغلق
    fuels: [
      {
        id: "gasoil",
        name: "غازوال",                     // ⬅️ اسم نوع الوقود
        icon: "🛢️",
        price: 330,                          // ⬅️ السعر بالأوقية للتر
        stock: 8500,                         // ⬅️ الكمية المتوفرة (لتر)
        available: true                      // ⬅️ هل متوفر؟
      },
      {
        id: "essence",
        name: "إسنس",
        icon: "⚡",
        price: 380,
        stock: 6200,
        available: true
      }
    ]
  },

  {
    id: 2,
    name: "محطة الفجر",
    location: "نواكشوط — طريق الأمل",
    image: "",
    emoji: "🔥",
    rating: "4.5 ★",
    isOpen: true,
    fuels: [
      {
        id: "gasoil",
        name: "غازوال",
        icon: "🛢️",
        price: 325,
        stock: 12000,
        available: true
      },
      {
        id: "essence",
        name: "إسنس",
        icon: "⚡",
        price: 375,
        stock: 0,
        available: false                    // ⬅️ الإسنس غير متوفر في هذه المحطة
      }
    ]
  },

  {
    id: 3,
    name: "محطة الوحدة",
    location: "نواكشوط — المنطقة الحرة",
    image: "",
    emoji: "🌟",
    rating: "4.9 ★",
    isOpen: true,
    fuels: [
      {
        id: "gasoil",
        name: "غازوال",
        icon: "🛢️",
        price: 335,
        stock: 5000,
        available: true
      },
      {
        id: "essence",
        name: "إسنس",
        icon: "⚡",
        price: 390,
        stock: 9800,
        available: true
      }
    ]
  },

  {
    id: 4,
    name: "محطة السلام",
    location: "نواذيبو — المدخل الشمالي",
    image: "",
    emoji: "🚀",
    rating: "4.3 ★",
    isOpen: false,                          // ⬅️ المحطة مغلقة حالياً
    fuels: [
      {
        id: "gasoil",
        name: "غازوال",
        icon: "🛢️",
        price: 340,
        stock: 7000,
        available: true
      },
      {
        id: "essence",
        name: "إسنس",
        icon: "⚡",
        price: 395,
        stock: 4500,
        available: true
      }
    ]
  },

  {
    id: 5,
    name: "محطة الرياح",
    location: "روصو — وسط المدينة",
    image: "",
    emoji: "💎",
    rating: "4.6 ★",
    isOpen: true,
    fuels: [
      {
        id: "gasoil",
        name: "غازوال",
        icon: "🛢️",
        price: 320,
        stock: 15000,
        available: true
      },
      {
        id: "essence",
        name: "إسنس",
        icon: "⚡",
        price: 370,
        stock: 8000,
        available: true
      }
    ]
  },

  {
    id: 6,
    name: "محطة الربيع",
    location: "كيفة — الطريق الرئيسي",
    image: "",
    emoji: "🌙",
    rating: "4.2 ★",
    isOpen: true,
    fuels: [
      {
        id: "gasoil",
        name: "غازوال",
        icon: "🛢️",
        price: 330,
        stock: 0,
        available: false
      },
      {
        id: "essence",
        name: "إسنس",
        icon: "⚡",
        price: 385,
        stock: 11000,
        available: true
      }
    ]
  }

];

// ============================================================
//  البنوك الموريتانية — أضف أو عدّل حسب رغبتك
// ============================================================
const banks = [

  {
    id: "bci",
    name: "BCI",                           // ⬅️ اسم البنك
    fullName: "بنك التجاري الدولي",        // ⬅️ الاسم الكامل
    logo: "🏦",                             // ⬅️ أيقونة أو مسار صورة
    tag: "دفع مباشر"                        // ⬅️ وصف قصير
  },

  {
    id: "bimf",
    name: "BIMF",
    fullName: "بنك الإسلامي الموريتاني",
    logo: "🕌",
    tag: "إسلامي"
  },

  {
    id: "bmci",
    name: "BMCI",
    fullName: "بنك المغربي التجاري",
    logo: "💳",
    tag: "تحويل فوري"
  },

  {
    id: "snim_pay",
    name: "Masrivi",                       // ⬅️ يمكن إضافة مدفوعات موبايل مثل مصريفي
    fullName: "مصريفي",
    logo: "📱",
    tag: "دفع موبايل"
  },

  {
    id: "mauritaniapost",
    name: "La Poste",
    fullName: "بريد موريتانيا",
    logo: "📮",
    tag: "تحويل بريدي"
  },

  {
    id: "bcp",
    name: "BCP",
    fullName: "بنك الشعبي",
    logo: "🏛️",
    tag: "دفع سريع"
  }

];