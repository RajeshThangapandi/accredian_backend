-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `yourName` VARCHAR(191) NOT NULL,
    `yourEmail` VARCHAR(191) NOT NULL,
    `friendsName` VARCHAR(191) NOT NULL,
    `friendsEmail` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
