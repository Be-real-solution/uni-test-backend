-- CreateTable
CREATE TABLE "user_log" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "hemis_id" VARCHAR(128) NOT NULL,
    "fullname" VARCHAR(64) NOT NULL,
    "group_id" UUID NOT NULL,
    "course" SMALLINT NOT NULL,
    "semester" SMALLINT NOT NULL,
    "group_name" VARCHAR(128) NOT NULL,
    "faculty" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_log" ADD CONSTRAINT "user_log_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
