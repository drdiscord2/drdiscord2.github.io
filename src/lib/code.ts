import { getLatestVersion } from "./tbs-version.ts";

export const kotlinSetupBlock = async () => {
    return `repositories {
    // All your repositories are here, then add:
    maven("https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/")
    maven("https://maven.fzzyhmstrs.me/")
    maven("https://thedarkcolour.github.io/KotlinForForge/")
    maven("https://api.modrinth.com/maven")
    maven("https://maven.blamejared.com")
    maven("https://maven.stardustmodding.org/public-snapshots/")
}

dependencies {
    implementation("dev.wendigodrip:thebrokenscript:${await getLatestVersion()}")

    // These are needed so you can use TBS APIs properly.
    // Even if you aren't using Kotlin, you need to have KFF as a dependency unless you want compiler errors.
    implementation("software.bernie.geckolib:geckolib-neoforge-1.21.1:4.7.3")
    implementation("me.fzzyhmstrs:fzzy_config:0.6.9+1.21+neoforge")
    implementation("thedarkcolour:kotlinforforge-neoforge:5.7.0")
    implementation("com.tterrag.registrate:Registrate:MC1.21-1.3.0+67")
}`;
};

export const groovySetupBlock = async () => {
    return `repositories {
    // All your repositories are here, then add:
    maven { url "https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/" }
    maven { url "https://maven.fzzyhmstrs.me/" }
    maven { url "https://thedarkcolour.github.io/KotlinForForge/" }
    maven { url "https://api.modrinth.com/maven" }
    maven { url "https://maven.blamejared.com" }
    maven { url "https://maven.stardustmodding.org/public-snapshots/" }
}

dependencies {
    implementation("dev.wendigodrip:thebrokenscript:${await getLatestVersion()}")

    // These are needed so you can use TBS APIs properly.
    // Even if you aren't using Kotlin, you need to have KFF as a dependency unless you want compiler errors.
    implementation("software.bernie.geckolib:geckolib-neoforge-1.21.1:4.7.3")
    implementation("me.fzzyhmstrs:fzzy_config:0.6.9+1.21+neoforge")
    implementation("thedarkcolour:kotlinforforge-neoforge:5.7.0")
    implementation("com.tterrag.registrate:Registrate:MC1.21-1.3.0+67")
}`;
};
