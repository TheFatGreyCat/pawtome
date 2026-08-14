export type Locale = "en-US" | "en-GB" | "vi";
export type CatalogGroup = "dog" | "cat" | "bird" | "small-mammal" | "reptile" | "freshwater-fish";
export type LocalText = Record<Locale, string>;

export type Citation = {
  id: string;
  title: string;
  authorsOrOrganization: string;
  publicationYear: number | null;
  journalOrPublisher: string;
  identifier: string | null;
  url: string;
  evidenceType: "breed-registry" | "veterinary-guideline" | "veterinary-manual" | "welfare-guidance";
  evidenceStrength: "authoritative" | "professional-consensus" | "reviewed-guidance";
  accessedAt: string;
  reviewedAt: string;
  applicableSpecies: CatalogGroup[];
  supportedClaim: string;
  limitations: string;
};

export type AnimalEntry = {
  slug: string;
  commonName: LocalText;
  scientificName: string;
  group: CatalogGroup;
  entryKind: "breed" | "species" | "variety";
  origin: string | null;
  activity: "low" | "moderate" | "high" | "needs-review";
  beginnerSuitability: "potentially-suitable" | "experienced-care" | "needs-review";
  size: string | null;
  lifespan: string | null;
  imageUrl: string;
  imageAlt: LocalText;
  summary: LocalText;
  housing: LocalText;
  feeding: LocalText;
  enrichment: LocalText;
  socialNeeds: LocalText;
  maintenance: LocalText;
  training: LocalText;
  welfare: LocalText;
  health: LocalText;
  suitability: LocalText;
  climateSensitivity: LocalText;
  citationIds: string[];
  reviewedAt: string;
  reviewStatus: "reviewed-general" | "needs-entry-review";
};

const REVIEWED_AT = "2026-08-14";
const t = (en: string, vi: string): LocalText => ({ "en-US": en, "en-GB": en, vi });

export const citations: Citation[] = [
  ["fci-breed-nomenclature", "FCI Breeds Nomenclature", "Fédération Cynologique Internationale", null, "Fédération Cynologique Internationale", "https://fci.be/en/nomenclature/Default.aspx", "breed-registry", "authoritative", ["dog"], "Breed naming and classification.", "Does not establish an individual dog's temperament, health, or lifespan."],
  ["cfa-recognized-breeds", "CFA Recognized Breeds", "The Cat Fanciers' Association", null, "The Cat Fanciers' Association", "https://cfa.org/breeds/", "breed-registry", "authoritative", ["cat"], "Recognized cat-breed naming and broad registry descriptions.", "Registry descriptions are not predictions for an individual cat."],
  ["aav-basic-care", "Basic Care for Companion Birds", "Association of Avian Veterinarians", 2019, "Association of Avian Veterinarians", "https://www.aav.org/resource/resmgr/pdf_2019/AAV_Basic-Care-for-Companion.pdf", "veterinary-guideline", "professional-consensus", ["bird"], "General companion-bird housing, nutrition, exercise, rest, and observation principles.", "Species-specific care still requires avian-veterinary review."],
  ["aav-environmental-needs", "Environmental Needs of Birds", "Association of Avian Veterinarians", 2023, "Association of Avian Veterinarians", "https://www.aav.org/blogpost/1778905/489481/Environmental-Needs-of-Birds", "veterinary-guideline", "professional-consensus", ["bird"], "Birds need rest, foraging, nutrition, exercise, grooming opportunities, socialization, and privacy.", "General framework, not a species-specific prescription."],
  ["merck-rabbit-home", "Providing a Home for a Rabbit", "Diane McClure, DVM, PhD, DACLAM", 2020, "MSD Veterinary Manual", "https://www.merckvetmanual.com/all-other-pets/rabbits/providing-a-home-for-a-rabbit", "veterinary-manual", "reviewed-guidance", ["small-mammal"], "Rabbit housing, diet, and exercise need deliberate planning.", "Rabbit-focused; do not apply its diet to other small mammals."],
  ["rspca-small-pets", "Choosing the Best Pet for Your Family", "Royal Society for the Prevention of Cruelty to Animals", null, "RSPCA", "https://www.rspca.org.uk/findapet/advice/families", "welfare-guidance", "reviewed-guidance", ["small-mammal"], "Small-pet species differ in housing, diet, handling, enrichment, and companionship.", "Welfare guidance, not a clinical or species-specific husbandry prescription."],
  ["merck-reptile-husbandry", "Management and Husbandry of Reptiles", "Stephen J. Divers, BVetMed, DACZM, DECZM, FRCVS; Jessica R. Comolli, DVM, DACZM, MS", 2025, "MSD Veterinary Manual", "https://www.merckvetmanual.com/exotic-and-laboratory-animals/reptiles/management-and-husbandry-of-reptiles", "veterinary-manual", "reviewed-guidance", ["reptile"], "Reptile enclosure, heat, humidity, light, diet, and social housing must be species-specific.", "Values and compatibility cannot be generalized across reptiles."],
  ["merck-fish-home", "Providing a Home for Fish", "Ruth Francis-Floyd, DVM, DACZM; Barbara D. Petty, DVM", 2020, "MSD Veterinary Manual", "https://www.merckvetmanual.com/all-other-pets/fish/providing-a-home-for-fish", "veterinary-manual", "reviewed-guidance", ["freshwater-fish"], "Aquarium welfare depends on setup, water quality, filtration, stocking, diet, and maintenance.", "Water parameters and compatible stocking remain species-specific."],
  ["wsava-nutrition", "Global Nutrition Guidelines", "World Small Animal Veterinary Association Global Nutrition Committee", 2021, "World Small Animal Veterinary Association", "https://wsava.org/global-guidelines/global-nutrition-guidelines/", "veterinary-guideline", "professional-consensus", ["dog", "cat"], "Nutrition should be assessed for the individual animal and complete diet.", "Diet must be individualized by life stage, body condition, and health."],
  ["avsab-humane-training", "Humane Dog Training Position Statement", "American Veterinary Society of Animal Behavior", 2021, "American Veterinary Society of Animal Behavior", "https://avsab.org/wp-content/uploads/2021/08/AVSAB-Humane-Dog-Training-Position-Statement-2021.pdf", "veterinary-guideline", "professional-consensus", ["dog"], "Reward-based methods should be used for dog training and behavior modification.", "Does not guarantee a result for a breed or individual."],
  ["aaha-behavior-guidelines", "2015 AAHA Canine and Feline Behavior Management Guidelines", "American Animal Hospital Association Behavior Management Guidelines Task Force", 2015, "Journal of the American Animal Hospital Association", "https://www.aaha.org/resources/2015-aaha-canine-and-feline-behavior-management-guidelines/", "veterinary-guideline", "professional-consensus", ["dog", "cat"], "Behavior assessment should consider health, development, environment, and the individual animal.", "Behavior guidance is not diagnostic."],
  ["merck-food-hazards", "Food Hazards", "Sharon M. Gwaltney-Brant, DVM, PhD, DABVT, DABT", 2020, "MSD Veterinary Manual", "https://www.merckvetmanual.com/special-pet-topics/poisoning/food-hazards", "veterinary-manual", "reviewed-guidance", ["dog", "cat", "bird", "small-mammal", "freshwater-fish"], "Foods including grapes or raisins and xylitol can cause serious poisoning in susceptible species.", "Risk depends on species, dose, product, and patient; suspected exposure needs prompt professional advice."],
].map(([id, title, authorsOrOrganization, publicationYear, journalOrPublisher, url, evidenceType, evidenceStrength, applicableSpecies, supportedClaim, limitations]) => ({
  id, title, authorsOrOrganization, publicationYear, journalOrPublisher, identifier: null, url, evidenceType, evidenceStrength,
  accessedAt: REVIEWED_AT, reviewedAt: REVIEWED_AT, applicableSpecies, supportedClaim, limitations,
} as Citation));

type Row = [string, string, string | null, CatalogGroup, string, string | null, AnimalEntry["activity"], AnimalEntry["beginnerSuitability"]];
const rows: Row[] = [
  ["shiba-inu","Shiba Inu",null,"dog","Canis lupus familiaris","Japan","high","experienced-care"],
  ["golden-retriever","Golden Retriever",null,"dog","Canis lupus familiaris","Scotland","high","potentially-suitable"],
  ["border-collie","Border Collie",null,"dog","Canis lupus familiaris","United Kingdom","high","experienced-care"],
  ["german-shepherd-dog","German Shepherd",null,"dog","Canis lupus familiaris","Germany","high","experienced-care"],
  ["siberian-husky","Siberian Husky",null,"dog","Canis lupus familiaris","Siberia","high","experienced-care"],
  ["labrador-retriever","Labrador Retriever",null,"dog","Canis lupus familiaris","Canada","high","potentially-suitable"],
  ["standard-poodle","Standard Poodle",null,"dog","Canis lupus familiaris","France","high","potentially-suitable"],
  ["beagle","Beagle",null,"dog","Canis lupus familiaris","United Kingdom","high","needs-review"],
  ["french-bulldog","French Bulldog",null,"dog","Canis lupus familiaris","France","moderate","needs-review"],
  ["dachshund","Dachshund",null,"dog","Canis lupus familiaris","Germany","moderate","needs-review"],
  ["cavalier-king-charles-spaniel","Cavalier King Charles Spaniel",null,"dog","Canis lupus familiaris","United Kingdom","moderate","needs-review"],
  ["australian-shepherd","Australian Shepherd",null,"dog","Canis lupus familiaris","United States","high","experienced-care"],
  ["boxer","Boxer",null,"dog","Canis lupus familiaris","Germany","high","needs-review"],
  ["great-dane","Great Dane",null,"dog","Canis lupus familiaris","Germany","moderate","experienced-care"],
  ["chihuahua","Chihuahua",null,"dog","Canis lupus familiaris","Mexico","moderate","needs-review"],
  ["pomeranian","Pomeranian",null,"dog","Canis lupus familiaris","Germany/Poland","moderate","needs-review"],
  ["miniature-schnauzer","Miniature Schnauzer",null,"dog","Canis lupus familiaris","Germany","high","needs-review"],
  ["greyhound","Greyhound",null,"dog","Canis lupus familiaris","United Kingdom","moderate","needs-review"],
  ["pembroke-welsh-corgi","Pembroke Welsh Corgi",null,"dog","Canis lupus familiaris","Wales","high","needs-review"],
  ["shih-tzu","Shih Tzu",null,"dog","Canis lupus familiaris","Tibet/China","moderate","needs-review"],
  ["british-shorthair","British Shorthair",null,"cat","Felis catus","United Kingdom","moderate","potentially-suitable"],
  ["maine-coon","Maine Coon",null,"cat","Felis catus","United States","moderate","needs-review"],
  ["ragdoll","Ragdoll",null,"cat","Felis catus","United States","moderate","needs-review"],
  ["siamese","Siamese",null,"cat","Felis catus","Thailand","high","needs-review"],
  ["abyssinian","Abyssinian",null,"cat","Felis catus",null,"high","experienced-care"],
  ["bengal","Bengal",null,"cat","Felis catus","United States","high","experienced-care"],
  ["birman","Birman",null,"cat","Felis catus",null,"moderate","needs-review"],
  ["burmese","Burmese",null,"cat","Felis catus","Myanmar/Thailand","high","needs-review"],
  ["persian","Persian",null,"cat","Felis catus",null,"low","experienced-care"],
  ["russian-blue","Russian Blue",null,"cat","Felis catus","Russia","moderate","needs-review"],
  ["scottish-fold","Scottish Fold",null,"cat","Felis catus","Scotland","moderate","experienced-care"],
  ["sphynx","Sphynx",null,"cat","Felis catus","Canada","high","experienced-care"],
  ["norwegian-forest-cat","Norwegian Forest Cat",null,"cat","Felis catus","Norway","moderate","needs-review"],
  ["siberian-cat","Siberian",null,"cat","Felis catus","Russia","moderate","needs-review"],
  ["american-shorthair","American Shorthair",null,"cat","Felis catus","United States","moderate","potentially-suitable"],
  ["budgerigar","Budgerigar","Yến phụng","bird","Melopsittacus undulatus","Australia","high","needs-review"],
  ["cockatiel","Cockatiel","Vẹt mào Úc","bird","Nymphicus hollandicus","Australia","high","needs-review"],
  ["zebra-finch","Zebra Finch","Sẻ vằn","bird","Taeniopygia guttata","Australia","high","needs-review"],
  ["domestic-canary","Domestic Canary","Hoàng yến","bird","Serinus canaria domestica","Macaronesia","moderate","needs-review"],
  ["peach-faced-lovebird","Peach-faced Lovebird","Vẹt uyên ương mặt hồng","bird","Agapornis roseicollis","Southwestern Africa","high","experienced-care"],
  ["green-cheeked-conure","Green-cheeked Conure","Vẹt má xanh","bird","Pyrrhura molinae","South America","high","experienced-care"],
  ["african-grey-parrot","African Grey Parrot","Vẹt xám châu Phi","bird","Psittacus erithacus","Central Africa","high","experienced-care"],
  ["blue-and-yellow-macaw","Blue-and-yellow Macaw","Vẹt đuôi dài xanh vàng","bird","Ara ararauna","South America","high","experienced-care"],
  ["rose-ringed-parakeet","Rose-ringed Parakeet","Vẹt cổ hồng","bird","Psittacula krameri","Africa/South Asia","high","experienced-care"],
  ["domestic-pigeon","Domestic Pigeon","Bồ câu nhà","bird","Columba livia domestica",null,"moderate","needs-review"],
  ["java-sparrow","Java Sparrow","Sẻ Java","bird","Padda oryzivora","Indonesia","high","needs-review"],
  ["society-finch","Society Finch","Sẻ xã hội","bird","Lonchura striata domestica","Captive variety","high","needs-review"],
  ["domestic-rabbit","Domestic Rabbit","Thỏ nhà","small-mammal","Oryctolagus cuniculus domesticus",null,"high","needs-review"],
  ["netherland-dwarf-rabbit","Netherland Dwarf Rabbit","Thỏ lùn Hà Lan","small-mammal","Oryctolagus cuniculus domesticus","Netherlands","high","experienced-care"],
  ["holland-lop-rabbit","Holland Lop Rabbit","Thỏ tai cụp Hà Lan","small-mammal","Oryctolagus cuniculus domesticus","Netherlands","high","experienced-care"],
  ["guinea-pig","Guinea Pig","Bọ ú","small-mammal","Cavia porcellus","South America","moderate","needs-review"],
  ["syrian-hamster","Syrian Hamster","Chuột hamster Syria","small-mammal","Mesocricetus auratus","Syria/Türkiye","moderate","needs-review"],
  ["mongolian-gerbil","Mongolian Gerbil","Chuột nhảy Mông Cổ","small-mammal","Meriones unguiculatus","Central/East Asia","high","needs-review"],
  ["fancy-rat","Fancy Rat","Chuột cảnh","small-mammal","Rattus norvegicus domestica",null,"high","needs-review"],
  ["long-tailed-chinchilla","Long-tailed Chinchilla","Sóc sin-sin","small-mammal","Chinchilla lanigera","Chile","high","experienced-care"],
  ["leopard-gecko","Leopard Gecko","Tắc kè da báo","reptile","Eublepharis macularius","South/Central Asia","moderate","experienced-care"],
  ["crested-gecko","Crested Gecko","Tắc kè mào","reptile","Correlophus ciliatus","New Caledonia","moderate","experienced-care"],
  ["central-bearded-dragon","Central Bearded Dragon","Rồng Úc","reptile","Pogona vitticeps","Australia","moderate","experienced-care"],
  ["corn-snake","Corn Snake","Rắn ngô","reptile","Pantherophis guttatus","United States","low","experienced-care"],
  ["ball-python","Ball Python","Trăn bóng","reptile","Python regius","West/Central Africa","low","experienced-care"],
  ["eastern-blue-tongued-skink","Eastern Blue-tongued Skink","Thằn lằn lưỡi xanh","reptile","Tiliqua scincoides","Australia","moderate","experienced-care"],
  ["red-eared-slider","Red-eared Slider","Rùa tai đỏ","reptile","Trachemys scripta elegans","United States/Mexico","moderate","experienced-care"],
  ["russian-tortoise","Russian Tortoise","Rùa Nga","reptile","Testudo horsfieldii","Central Asia","moderate","experienced-care"],
  ["siamese-fighting-fish","Siamese Fighting Fish","Cá betta","freshwater-fish","Betta splendens","Southeast Asia","moderate","experienced-care"],
  ["goldfish","Goldfish","Cá vàng","freshwater-fish","Carassius auratus","East Asia","moderate","experienced-care"],
  ["guppy","Guppy","Cá bảy màu","freshwater-fish","Poecilia reticulata","Northeastern South America","high","needs-review"],
  ["neon-tetra","Neon Tetra","Cá neon","freshwater-fish","Paracheirodon innesi","Amazon basin","high","needs-review"],
  ["zebra-danio","Zebra Danio","Cá ngựa vằn","freshwater-fish","Danio rerio","South Asia","high","needs-review"],
  ["peppered-corydoras","Peppered Corydoras","Cá chuột tiêu","freshwater-fish","Corydoras paleatus","South America","moderate","needs-review"],
  ["southern-platyfish","Southern Platyfish","Cá mún","freshwater-fish","Xiphophorus maculatus","Central America","moderate","needs-review"],
  ["dwarf-gourami","Dwarf Gourami","Cá sặc gấm","freshwater-fish","Trichogaster lalius","South Asia","moderate","experienced-care"],
];

const sourceIds: Record<CatalogGroup, string[]> = {
  dog:["fci-breed-nomenclature","wsava-nutrition","avsab-humane-training","aaha-behavior-guidelines"],
  cat:["cfa-recognized-breeds","wsava-nutrition","aaha-behavior-guidelines"],
  bird:["aav-basic-care","aav-environmental-needs"],
  "small-mammal":["rspca-small-pets","merck-rabbit-home"],
  reptile:["merck-reptile-husbandry"],
  "freshwater-fish":["merck-fish-home"],
};

const guidance: Record<CatalogGroup, Pick<AnimalEntry,"summary"|"housing"|"feeding"|"enrichment"|"socialNeeds"|"maintenance"|"training"|"welfare"|"health"|"suitability"|"climateSensitivity">> = {
  dog:{summary:t("A recognized dog breed. Breed tendencies never guarantee an individual dog's behavior or health.","Một giống chó được công nhận. Xu hướng giống không bao giờ bảo đảm hành vi hay sức khỏe của từng chó."),housing:t("Provide safe rest, toileting access, exercise, and space matched to the individual.","Cần nơi nghỉ an toàn, cơ hội đi vệ sinh, vận động và không gian phù hợp từng cá thể."),feeding:t("Feed a complete diet appropriate to life stage and body condition; individual plans belong with a veterinarian.","Cho ăn khẩu phần hoàn chỉnh phù hợp giai đoạn sống và thể trạng; kế hoạch cá nhân cần bác sĩ thú y."),enrichment:t("Use sniffing, play, exploration, and reward-based learning.","Dùng đánh hơi, chơi, khám phá và học có thưởng."),socialNeeds:t("Provide safe voluntary interaction and protected rest; social preference varies.","Tạo tương tác an toàn, tự nguyện và thời gian nghỉ; sở thích xã hội khác nhau."),maintenance:t("Coat, nail, dental, ear, and preventive care need entry-specific review.","Lông, móng, răng, tai và chăm sóc phòng ngừa cần rà soát riêng."),training:t("Use reward-based methods and short sessions.","Dùng phương pháp có thưởng và buổi tập ngắn."),welfare:t("Assess exercise, care cost, conformation concerns, and the individual—not appearance alone.","Cân nhắc vận động, chi phí, hình thể và từng cá thể—không chỉ ngoại hình."),health:t("Entry-specific predispositions need review; this catalog does not diagnose or predict health.","Khuynh hướng riêng cần rà soát; danh mục không chẩn đoán hay dự đoán sức khỏe."),suitability:t("Children and other pets require adult supervision, gradual introductions, and individual assessment.","Trẻ em và thú khác cần người lớn giám sát, làm quen từ từ và đánh giá từng cá thể."),climateSensitivity:t("Tolerance varies with coat, body shape, age, and health; seek entry-specific advice.","Khả năng chịu khí hậu tùy lông, hình thể, tuổi và sức khỏe; cần tư vấn riêng.")},
  cat:{summary:t("A recognized cat breed. Registry descriptions are starting points, not guarantees.","Một giống mèo được công nhận. Mô tả hiệp hội chỉ là điểm khởi đầu, không phải bảo đảm."),housing:t("Provide hiding, elevated rest, scratching, toileting resources, and choice over interaction.","Cung cấp nơi ẩn, chỗ nghỉ cao, bề mặt cào, khay vệ sinh và quyền chọn tương tác."),feeding:t("Feed a complete feline diet appropriate to life stage and body condition.","Cho ăn khẩu phần hoàn chỉnh cho mèo, phù hợp giai đoạn sống và thể trạng."),enrichment:t("Offer hunting-like play, climbing, scratching, foraging, and predictable rest.","Tạo trò mô phỏng săn mồi, leo, cào, tìm thức ăn và nghỉ ngơi dễ đoán."),socialNeeds:t("Provide choice, gradual introductions, and enough separated resources.","Cho quyền lựa chọn, làm quen từ từ và đủ tài nguyên tách biệt."),maintenance:t("Coat, claw, dental, and preventive care need entry-specific review.","Lông, móng, răng và chăm sóc phòng ngừa cần rà soát riêng."),training:t("Use reward-based cooperative care and environmental setup without force.","Dùng chăm sóc hợp tác có thưởng và sắp xếp môi trường, không ép buộc."),welfare:t("Select for health and welfare, not appearance alone.","Ưu tiên sức khỏe và phúc lợi, không chỉ ngoại hình."),health:t("Entry-specific predispositions need review; changes need veterinary assessment.","Khuynh hướng riêng cần rà soát; thay đổi cần bác sĩ thú y đánh giá."),suitability:t("Use calm supervised interaction and gradual introductions; suitability is individual.","Tương tác bình tĩnh có giám sát và làm quen từ từ; phù hợp tùy cá thể."),climateSensitivity:t("Tolerance varies with coat, skin, body shape, age, and health.","Khả năng chịu khí hậu tùy lông, da, hình thể, tuổi và sức khỏe.")},
  bird:{summary:t("A companion-bird species or variety with complex species-specific welfare needs.","Một loài hoặc biến thể chim cảnh có nhu cầu phúc lợi phức tạp theo loài."),housing:t("Provide a clean secure enclosure and safe exercise or flight space.","Cung cấp chuồng sạch, an toàn và không gian bay hoặc vận động."),feeding:t("Diet is species-specific; seed-only diets are not complete guidance.","Khẩu phần tùy loài; chế độ chỉ ăn hạt không phải hướng dẫn hoàn chỉnh."),enrichment:t("Provide foraging, manipulation, bathing or preening, exercise, and rest.","Tạo cơ hội tìm thức ăn, thao tác, tắm hay rỉa lông, vận động và nghỉ."),socialNeeds:t("Social and privacy needs vary; avoid both isolation and forced interaction.","Nhu cầu xã hội và riêng tư khác nhau; tránh cô lập lẫn ép tương tác."),maintenance:t("Daily cleaning and observation are general needs; details require avian review.","Vệ sinh và quan sát hằng ngày là nhu cầu chung; chi tiết cần chuyên gia chim."),training:t("Use voluntary reward-based handling for cooperative care.","Dùng xử lý tự nguyện có thưởng cho chăm sóc hợp tác."),welfare:t("Small cages, poor diet, sleep disruption, and inadequate enrichment compromise welfare.","Chuồng nhỏ, khẩu phần kém, gián đoạn ngủ và thiếu làm giàu môi trường ảnh hưởng phúc lợi."),health:t("No species-specific diagnosis is asserted; subtle changes need prompt avian-veterinary advice.","Không chẩn đoán riêng theo loài; thay đổi kín đáo cần tư vấn thú y chim sớm."),suitability:t("Adult responsibility is essential; birds can be fragile, stressed, and capable of biting.","Người lớn phải chịu trách nhiệm; chim có thể mong manh, căng thẳng và cắn."),climateSensitivity:t("Temperature, humidity, drafts, ventilation, and light cycles need species review.","Nhiệt độ, độ ẩm, gió lùa, thông gió và chu kỳ sáng cần rà soát theo loài.")},
  "small-mammal":{summary:t("A rabbit breed or small-mammal species with distinct housing, diet, handling, and companionship needs.","Một giống thỏ hoặc thú nhỏ có nhu cầu riêng về chuồng, thức ăn, xử lý và bầu bạn."),housing:t("Provide secure spacious housing with species-appropriate substrate, shelter, and exercise.","Cung cấp nơi ở rộng, an toàn với nền, chỗ trú và vận động phù hợp loài."),feeding:t("Diet is species-specific; rabbit guidance must not be reused for rodents.","Khẩu phần tùy loài; không áp dụng hướng dẫn cho thỏ sang gặm nhấm."),enrichment:t("Support species-typical digging, gnawing, hiding, foraging, climbing, or burrowing.","Hỗ trợ đào, gặm, ẩn, tìm thức ăn, leo hay làm hang tùy loài."),socialNeeds:t("Some species need compatible companions while others are solitary or territorial.","Có loài cần bạn phù hợp, có loài sống đơn hoặc bảo vệ lãnh thổ."),maintenance:t("Daily observation and cleaning are general; details need species review.","Quan sát và vệ sinh hằng ngày là nhu cầu chung; chi tiết cần rà soát theo loài."),training:t("Use calm reward-based handling; never force a fearful animal.","Xử lý bình tĩnh có thưởng; không ép con vật đang sợ."),welfare:t("Insufficient space, wrong companionship, poor diet, and unsuitable handling are welfare risks.","Thiếu không gian, bầu bạn sai, khẩu phần kém và xử lý không phù hợp là nguy cơ."),health:t("Entry-specific risks need review; small mammals may hide illness.","Nguy cơ riêng cần rà soát; thú nhỏ có thể che giấu bệnh."),suitability:t("An adult must provide care; many are fragile, nocturnal, or stressed by handling.","Người lớn phải chăm sóc; nhiều loài mong manh, hoạt động đêm hoặc căng thẳng khi bế."),climateSensitivity:t("Temperature, humidity, ventilation, bedding, and heat exposure need species review.","Nhiệt độ, độ ẩm, thông gió, chất lót và phơi nóng cần rà soát theo loài.")},
  reptile:{summary:t("A reptile species whose husbandry must be researched by species.","Một loài bò sát có cách chăm sóc phải nghiên cứu riêng theo loài."),housing:t("Enclosure, thermal gradient, humidity, lighting, substrate, and hides require species values.","Chuồng, dải nhiệt, độ ẩm, ánh sáng, nền và chỗ ẩn cần thông số theo loài."),feeding:t("Diet and supplementation are species-specific; consult an exotics veterinarian.","Khẩu phần và bổ sung tùy loài; hãy hỏi bác sĩ thú y ngoại lai."),enrichment:t("Provide safe opportunities for species-typical climbing, burrowing, basking, swimming, or exploration.","Tạo cơ hội an toàn để leo, đào, sưởi, bơi hay khám phá tùy loài."),socialNeeds:t("Many reptiles are healthiest alone; never mix species and review co-housing carefully.","Nhiều bò sát khỏe nhất khi nuôi riêng; không trộn loài và phải rà soát nuôi chung."),maintenance:t("Measure heat and humidity, maintain hygiene, and keep husbandry records.","Đo nhiệt và độ ẩm, giữ vệ sinh và ghi chép chăm sóc."),training:t("Keep habituation and handling voluntary and species-appropriate.","Làm quen và xử lý tự nguyện, phù hợp loài."),welfare:t("Incorrect heat, UV, humidity, diet, space, or social housing can cause serious harm.","Nhiệt, UV, độ ẩm, khẩu phần, không gian hay nuôi chung sai có thể gây hại nghiêm trọng."),health:t("No diagnosis is asserted; abnormal appetite, shedding, breathing, or posture needs an exotics veterinarian.","Không chẩn đoán; ăn uống, lột da, hô hấp hay tư thế bất thường cần bác sĩ thú y ngoại lai."),suitability:t("Adult care, secure separation from other pets, and hygiene are essential.","Người lớn chăm sóc, tách an toàn khỏi thú khác và vệ sinh là thiết yếu."),climateSensitivity:t("Controlled species-specific environmental ranges are required; room temperature is not a care plan.","Cần môi trường kiểm soát theo loài; nhiệt độ phòng không phải kế hoạch chăm sóc.")},
  "freshwater-fish":{summary:t("A freshwater species whose welfare depends on compatible water, stocking, social, and habitat conditions.","Một loài cá nước ngọt có phúc lợi phụ thuộc nước, mật độ, xã hội và môi trường phù hợp."),housing:t("Cycle the aquarium and match volume, filtration, temperature, chemistry, cover, and flow to the species.","Hoàn thiện chu trình bể và phù hợp thể tích, lọc, nhiệt, hóa học nước, nắp và dòng theo loài."),feeding:t("Feed an appropriate complete diet without compromising water quality.","Cho ăn khẩu phần hoàn chỉnh phù hợp mà không làm xấu nước."),enrichment:t("Provide species-appropriate plants, shelter, swimming space, substrate, and grouping.","Cung cấp cây, chỗ trú, vùng bơi, nền và nhóm phù hợp loài."),socialNeeds:t("Schooling, territorial, solitary, and sex-ratio needs differ.","Nhu cầu đàn, lãnh thổ, sống đơn và tỷ lệ giới tính khác nhau."),maintenance:t("Test water, maintain filtration, and make regular partial changes without abrupt shifts.","Kiểm tra nước, duy trì lọc và thay một phần đều đặn, tránh thay đổi đột ngột."),training:t("Focus on low-stress observation and husbandry rather than training claims.","Tập trung quan sát ít căng thẳng và chăm sóc thay vì khẳng định huấn luyện."),welfare:t("Poor water, overcrowding, incompatible stocking, and uncycled systems are preventable risks.","Nước kém, quá đông, ghép cá sai và bể chưa ổn định là nguy cơ phòng tránh được."),health:t("Signs are nonspecific; test the environment and consult an aquatic veterinarian before treatment.","Dấu hiệu không đặc hiệu; kiểm tra môi trường và hỏi bác sĩ thú y thủy sinh trước điều trị."),suitability:t("An adult must manage water testing, equipment, feeding, and veterinary decisions.","Người lớn phải quản lý kiểm tra nước, thiết bị, cho ăn và quyết định thú y."),climateSensitivity:t("Control aquarium temperature and chemistry for the species, not ambient weather.","Kiểm soát nhiệt độ và hóa học nước theo loài, không theo thời tiết phòng.")},
};

function createEntry([slug,name,vi,group,scientificName,origin,activity,beginnerSuitability]: Row): AnimalEntry {
  const entryKind = group === "dog" || group === "cat" || slug.includes("rabbit") ? "breed" : slug === "siamese-fighting-fish" ? "variety" : "species";
  return {slug,commonName:t(name,vi??name),scientificName,group,entryKind,origin,activity,beginnerSuitability,size:null,lifespan:null,imageUrl:"/brand/pawtome-logo.png",imageAlt:t(`${name} catalog entry`,`${vi??name}, mục trong danh mục`),...guidance[group],citationIds:sourceIds[group],reviewedAt:REVIEWED_AT,reviewStatus:"needs-entry-review"};
}

export const catalog: AnimalEntry[] = rows.map(createEntry);
export const localize = (value: LocalText, locale: Locale) => value[locale] || value["en-US"];
export const citationFor = (id: string) => citations.find((citation) => citation.id === id);
export const catalogCounts = catalog.reduce<Record<CatalogGroup,number>>((counts,entry)=>{counts[entry.group]++;return counts;},{dog:0,cat:0,bird:0,"small-mammal":0,reptile:0,"freshwater-fish":0});
