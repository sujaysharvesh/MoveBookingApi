generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  
  model User {
    id          String    @id @default(uuid())
    email       String    @unique
    username    String    @unique
    password    String
    firstName   String
    lastName    String?
    phoneNumber String?
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    isActive    Boolean   @default(true)
    role        UserRole  @default(user)
    bookings    Booking[]
    reviews     Review[]
  }
  
  enum UserRole {
    admin
    user
  }
  
  model Movie {
    id          String       @id @default(uuid())
    title       String
    description String       @db.Text
    duration    Int
    releaseDate DateTime
    language    String
    posterUrl   String?
    trailerUrl  String?
    genre       MovieGenre[]
    rating      Float        @default(0)
    isActive    Boolean      @default(true)
    createdAt   DateTime     @default(now())
    updatedAt   DateTime     @updatedAt
    screenings  Screening[]
    reviews     Review[]
  }
  
  enum MovieGenre {
    ACTION
    ADVENTURE
    COMEDY
    DRAMA
    HORROR
    SCIFI
    THRILLER
    ROMANCE
    DOCUMENTARY
    ANIMATION
    CRIME
    FANTASY
    FAMILY
  }
  
  model City {
    id       String    @id @default(uuid())
    name     String    @unique
    pincode  Int
    state    String
    theaters Theater[]
  }
  
  model Theater {
    id            String   @id @default(uuid())
    name          String
    address       String   @unique
    cityId        String
    city          City     @relation(fields: [cityId], references: [id])
    totalScreens  Int      @default(0)
    contactNumber String
    email         String
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt
    screens       Screen[]
  }
  
  model Screen {
    id         String      @id @default(uuid())
    name       String
    theaterId  String
    theater    Theater     @relation(fields: [theaterId], references: [id])
    capacity   Int
    screenType ScreenType  @default(STANDARD)
    screenings Screening[]
    seatLayout Seat[]
  }
  
  enum ScreenType {
    STANDARD
    IMAX
    PREMIUM
    VIP
  }
  
  model Seat {
    id       String       @id @default(uuid())
    screenId String
    screen   Screen       @relation(fields: [screenId], references: [id])
    row      String // Example: A, B, C
    number   Int // Example: 1, 2, 3
    category SeatCategory
    status   SeatStatus   @default(AVAILABLE)
    tickets  Ticket[]
  }
  
  enum SeatStatus {
    AVAILABLE
    BOOKED
    RESERVED
    UNAVAILABLE
  }
  
  enum SeatCategory {
    SILVER
    GOLD
    PLATINUM
  }
  
  
  model Screening {
    id        String      @id @default(uuid())
    movieId   String
    movie     Movie       @relation(fields: [movieId], references: [id])
    screenId  String
    screen    Screen      @relation(fields: [screenId], references: [id])
    startTime DateTime
    endTime   DateTime
    price     SeatPrice[]
    isActive  Boolean     @default(true)
    createdAt DateTime    @default(now())
    updatedAt DateTime    @updatedAt
    tickets   Ticket[]
  }
  
  model SeatPrice {
    id          String       @id @default(uuid())
    screeningId String
    screening   Screening    @relation(fields: [screeningId], references: [id])
    category    SeatCategory
    price       Decimal      @db.Decimal(10, 2)
  }
  
  model Booking {
    id            String         @id @default(uuid())
    userId        String
    user          User           @relation(fields: [userId], references: [id])
    bookingNumber String         @unique
    totalAmount   Decimal        @db.Decimal(10, 2)
    status        BookingStatus  @default(PENDING)
    paymentStatus PaymentStatus  @default(PENDING)
    paymentMethod PaymentMethod?
    createdAt     DateTime       @default(now())
    updatedAt     DateTime       @updatedAt
    tickets       Ticket[]
  }
  
  model Ticket {
    id           String    @id @default(uuid())
    bookingId    String
    booking      Booking   @relation(fields: [bookingId], references: [id])
    screeningId  String
    screening    Screening @relation(fields: [screeningId], references: [id])
    seatId       String
    seat         Seat      @relation(fields: [seatId], references: [id])
    price        Decimal   @db.Decimal(10, 2)
    ticketNumber String    @unique
    isCheckedIn  Boolean   @default(false)
    createdAt    DateTime  @default(now())
  }
  
  model Review {
    id        String   @id @default(uuid())
    userId    String
    user      User     @relation(fields: [userId], references: [id])
    movieId   String
    movie     Movie    @relation(fields: [movieId], references: [id])
    rating    Int      @db.SmallInt // 1-5 rating
    comment   String?  @db.Text
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  
    @@unique([userId, movieId])
  }
  
  enum BookingStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }
  
  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }
  
  enum PaymentMethod {
    CREDIT_CARD
    DEBIT_CARD
    UPI
    NET_BANKING
    WALLET
  }