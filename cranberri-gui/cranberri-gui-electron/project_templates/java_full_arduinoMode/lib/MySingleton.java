package com.example.project1.shared;

import jupiterpi.cranberri.runtime.api.IO;

public class MySingleton {
    public static final int MY_CONSTANT = 42;

    public static void mySharedMethod() {
        IO.writePin(1, IO.PinValue.HIGH);
    }
}