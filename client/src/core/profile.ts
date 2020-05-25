/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

export type ProfileStatus =  "NEW" | "READY";

export interface Profile {
    id?: string,
    status: ProfileStatus,
}



