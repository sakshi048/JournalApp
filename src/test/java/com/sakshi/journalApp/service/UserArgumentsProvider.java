package com.sakshi.journalApp.service;

import com.sakshi.journalApp.entity.Users;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;

import java.util.stream.Stream;

public class UserArgumentsProvider implements ArgumentsProvider {

    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) throws Exception {
        return Stream.of(
                Arguments.of(Users.builder().username("sakusaa").password("sakussaa").build()),
                Arguments.of(Users.builder().username("gharat").password("gharat").build())
        );
    }
}
