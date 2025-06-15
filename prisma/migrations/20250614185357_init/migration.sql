-- CreateTable
CREATE TABLE "WordList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "updateTime" BIGINT NOT NULL,
    "createTime" BIGINT NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "WordList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPair" (
    "id" TEXT NOT NULL,
    "word1" TEXT NOT NULL,
    "word2" TEXT NOT NULL,
    "progress" TEXT NOT NULL,
    "wordListId" TEXT NOT NULL,

    CONSTRAINT "WordPair_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WordPair" ADD CONSTRAINT "WordPair_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "WordList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
